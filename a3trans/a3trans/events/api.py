import frappe
from json import loads
import json
from a3trans.a3trans.doctype.booking_type.booking_type import BookingType
from frappe.utils import datetime
import string
import random


def generate_random_email():
    domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com"]
    username = ''.join(random.choices(string.ascii_letters + string.digits, k=random.randint(5, 10)))
    domain = random.choice(domains)
    return f"{username}@{domain}"

@frappe.whitelist(allow_guest=True)
def get_doctype_data(doctype, filters=None):
    docList = []
    getList = frappe.db.get_list(doctype, filters=filters)
    for item in getList:
        doc = frappe.get_doc(doctype, item["name"]).as_dict()
        docList.append(doc)

    return docList


@frappe.whitelist(allow_guest=True)
def create_booking(**kwargs):
    unconverted_status = ["Lead", "Open", "Replied"]
    booking_type = frappe.get_doc("Booking Type", kwargs["booking_type"])
    if frappe.db.exists("Lead", {"mobile_number": kwargs["mobile_number"]}):
        past_lead = frappe.get_doc("Lead", {"mobile_number": kwargs["mobile_number"]})
        if past_lead.status in unconverted_status:
            contact = frappe.get_doc("Contact", {"mobile_no": kwargs["mobile_number"]})
            leadName = create_new_lead(kwargs, booking_type, True)
            contact.append('links',{
                "link_doctype": "Lead",
                "link_name": leadName.name,
                "link_title": leadName.lead_name
            })
            contact.save()
            return leadName.as_dict()
            
        else:
            opp = create_new_opportunity(kwargs, booking_type)
            return opp.as_dict()
    else:
        leadName = create_new_lead(kwargs, booking_type, False)
        return leadName.as_dict()


def create_new_lead(data: dict, booking_type: BookingType, hasPrev: bool):
    lead = frappe.new_doc("Lead")
    lead.lead_name = data["lead_name"]
    lead.mobile_number = data["mobile_number"]

    if not hasPrev:
        lead.email_id = data["email_id"]
    else:
        lead.email_id = generate_random_email()
    lead.booking_channel = "Mobile App"
    lead.booking_date = frappe.utils.nowdate()
    lead.booking_type = booking_type.name
    lead.lead_owner = "Administrator"
    lead.remarks = data["remarks"]
   
    tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
    for service in data["addition_service"]["services"]:
        for item in tariff.additional_services:
            if item.additional_service == service["service"]:
                lead.append("additional_services", {
                    "additional_service": service["service"],
                    "quantity": 1,
                    "rate" :item.amount,
                    "amount" :item.amount
                })
    if booking_type.inventory_required == 1:
        lead.warehouse = data["warehouse"]
        lead.cargo_type = data["cargo_type"]
        lead.required_area = data["required_area"]
        lead.booked_upto = data["booked_upto"]
        lead.uom = data["uom"]
    
    if booking_type.location_required == 1:
        lead.vehicle_type = data["vehicle_type"]
        lead.append("shipment_details", {
            "item"      : data["commodity"],
            "weight"    : data["prod_weight"],
            "uom"       : data["prod_uom"],
            "quantity"  : data["no_of_pack"],
            "packaging_type":   data["package_type"]
            })
        lead.append("transit_details_item", {
            "transit_type": data["pick_transit_type"],
            "zone": data["pick_zone"],
            "quantity": data["pick_quantity"],
            "address_line1": data["pick_address_line1"],
            "address_line2": data["pick_address_line2"],
            "location": data["pick_location"],
            "city": data["pick_city"],
            "latitude": data["pick_latitude"],
            "longitude": data["pick_longitude"],
        })
        lead.append("transit_details_item", {
            "transit_type": data["drop_transit_type"],
            "zone": data["drop_zone"],
            "quantity": data["drop_quantity"],
            "address_line1": data["drop_address_line1"],
            "address_line2": data["drop_address_line2"],
            "location": data["drop_location"],
            "city": data["drop_city"],
            "latitude": data["drop_latitude"],
            "longitude": data["drop_longitude"],
        })
    
    lead.save()
    return lead

def create_new_opportunity(data: dict, booking_type: BookingType):
    opp = frappe.new_doc("Opportunity")
    opp.customer_name = data["lead_name"]
    opp.party_name = data["lead_name"]
    opp.order_status = "New"
    opp.mobile_number = data["mobile_number"]
    opp.vehicle_type = data["vehicle_type"]
    opp.booking_channel = "Mobile App"
    opp.booking_type = booking_type.name
    opp.booking_date = datetime.datetime.today()
    opp.append("shipment_details", {
        "item"      : data["commodity"],
        "weight"    : data["prod_weight"],
        "uom"       : data["prod_uom"],
        "quantity"  : data["no_of_pack"],
        "packaging_type":   data["package_type"]
        })
    opp.append("receiver_information",{
        "transit_type": data["pick_transit_type"],
        "zone": data["pick_zone"],
        "quantity": data["pick_quantity"],
        "address_line1": data["pick_address_line1"],
        "address_line2": data["pick_address_line2"],
        "location": data["pick_location"],
        "city": data["pick_city"],
        "latitude": data["pick_latitude"],
        "longitude": data["pick_longitude"],
        
    })
    opp.append("receiver_information",{
        "transit_type": data["drop_transit_type"],
        "zone": data["drop_zone"],
        "quantity": data["drop_quantity"],
        "address_line1": data["drop_address_line1"],
        "address_line2": data["drop_address_line2"],
        "location": data["drop_location"],
        "city": data["drop_city"],
        "latitude": data["drop_latitude"],
        "longitude": data["drop_longitude"],
        
    })
    
    opp.save()
    return opp


@frappe.whitelist(allow_guest=True)
def update_vehicle_assignment_status(index, vehicle_assigment_id,status):
    vehicle_assigment = frappe.get_doc("Vehicle Assignment", vehicle_assigment_id)
    for route in vehicle_assigment.routes:
        if route.idx == int(index):
            route.status = status
    vehicle_assigment.save()
    return vehicle_assigment.as_dict()