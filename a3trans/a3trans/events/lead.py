import frappe
import datetime
from datetime import date
from frappe.utils import today
import calendar
from functools import reduce
from frappe.utils import add_to_date
def after_insert(doc,methods):
    lead_doc=doc
    if lead_doc.mobile_number and lead_doc.email_id:
        if not frappe.db.exists("User", {"first_name":lead_doc.lead_name, "mobile_no":lead_doc.mobile_number,"email":lead_doc.email_id}):
            user = frappe.get_doc(
                {
                    "doctype": "User",
                    "mobile_no": lead_doc.mobile_number,
                    "user.phone" : lead_doc.mobile_number,
                    "first_name":lead_doc.lead_name,


                    
                    
                    "email":lead_doc.email_id,
                    "enabled": 1,  
                    "role_profile_name":"Logistic Customer",
                    "user_type": "Website User",
                    "send_welcome_email":0
                }
            )
            user.flags.ignore_permissions = True
            user.flags.ignore_password_policy = True
            user.insert()
            frappe.msgprint('User ' f'<a href="/app/user/{user.name}" target="blank">{user.name} </a> Created Successfully ')

def validate(doc,methods):
    if doc.booking_type:
        if frappe.db.exists("Booking Type",doc.booking_type):
            b_type = frappe.get_doc("Booking Type",doc.booking_type)
            if b_type.item :
                lead_doc=doc
                total_tr = 0
                total_ad = 0
                total_wr = 0
                if doc.transit_charges_item:   
                    for pr in doc.transit_charges_item:
                                        
                        if pr.cost:
                            total_tr += pr.cost
                if doc.additional_services:   
                    for ad in doc.additional_services:
                        if ad.amount:
                            total_ad += ad.amount

                if doc.warehouse_charges_item:  
                    for pr in doc.warehouse_charges_item:                           
                        if pr.cost:
                            total_wr += pr.cost
                
                doc.total_amount = total_tr + total_ad + total_wr
                if lead_doc.status=="Opportunity":
                    # if lead_doc.contact_by == "" or lead_doc.contact_by == None:
                    #     frappe.throw("Please Assign this lead to a Staff for further follow-up")
                    
                    # if lead_doc.address_link == "" or lead_doc.address_link == None:
                    #     frappe.throw("Please add Biling Address")
                    if frappe.db.exists("Customer",{"mobile_number":lead_doc.mobile_number}):
                        customer=frappe.get_doc("Customer",{"mobile_number":lead_doc.mobile_number})
                        opportunity = frappe.new_doc("Opportunity")
                        opportunity.party_name = customer.customer_name
                        opportunity.booking_type = lead_doc.booking_type
                        current_date = today()
                        opportunity.booking_date = current_date
                        opportunity.lead_id = lead_doc.name
                        if lead_doc.vehicle_type:
                            opportunity.vehicle_type = lead_doc.vehicle_type

                        receiver_info_data = []  # Define a list to hold receiver information data
                        if doc.transit_details_item:
                            for transit in doc.transit_details_item:
                                receiver_info_data.append(
                                    {"transit_type": transit.transit_type, "zone": transit.zone}
                                )
                                # You can add more data as needed for each transit item

                            # Loop through the data and append it to the "receiver_information" list
                            for info in receiver_info_data:
                                opportunity.append("receiver_information", info)
                        if doc.transit_charges_item:
                            charge_info_data = []  # Define a list to hold transit charges data
                            for charge in doc.transit_charges_item:
                                charge_info_data.append(
                                    {"charges": charge.charges, "description": charge.description, "quantity": 1, "cost": charge.cost}
                                )
                            # Loop through the data and append it to the "transit_charges" list
                            for info in charge_info_data:
                                opportunity.append("transit_charges", info)
                        if doc.warehouse_charges_item:
                            war_info_data = []  # Define a list to hold transit charges data
                            for war in doc.warehouse_charges_item:
                                war_info_data.append(
                                    {"charges": war.charges, "quantity": 1, "cost": war.cost}
                                )
                            # Loop through the data and append it to the "transit_charges" list
                            for info in war_info_data:
                                opportunity.append("warehouse_charges", info)
                        
                        if doc.shipment_details:
                            shipment_item = []
                            for shipment in doc.shipment_details:
                                shipment_item.append(
                                    {"item":shipment.item,"quantity":shipment.quantity,"weight":shipment.weight,"packaging_type":shipment.packaging_type}
                                )
                            for ship in shipment_item:
                                opportunity.append("shipment_details", ship)


                        line_itms = []
                        # Initialize the opportunity_line_items list to store the aggregated data
                        opportunity_line_items = []

                        # Loop through the transit_charges_item
                        if doc.transit_charges_item:

                            # Loop through the transit_charges_item
                            for i in doc.transit_charges_item:
                                qty = 0
                                cst = 0

                                # Check if i.charge is not in line_itms
                                if i.charges not in line_itms:
                                    line_itms.append(i.charges)

                                    # Iterate through the items again to aggregate values for the same charge
                                    for j in doc.transit_charges_item:
                                        if i.charges == j.charges:
                                            qty += j.quantity
                                            cst += j.cost

                                    print(qty, cst, "*************", line_itms)
                                    print((cst/2),"@@@@@@@@@@@@@@@@@2")

                                    # Append the aggregated data to the opportunity_line_items list
                                    opportunity_line_items.append({
                                        "item": i.charges,
                                        "quantity": qty,
                                        "amount": cst,
                                        "average_rate":(cst/2)
                                    })
                        if doc.warehouse_charges_item:
                        
                            for i in doc.warehouse_charges_item:
                                qty = 0
                                cst = 0

                            
                                if i.charges not in line_itms:
                                    line_itms.append(i.charges)

                                    # Iterate through the items again to aggregate values for the same charge
                                    for j in doc.warehouse_charges_item:
                                        if i.charges == j.charges:
                                            qty += j.quantity
                                            cst += j.cost

                                    print(qty, cst, "*************", line_itms)

                                    # Append the aggregated data to the opportunity_line_items list
                                    opportunity_line_items.append({
                                        "item": i.charges,
                                        "quantity": qty,
                                        "amount": cst,
                                        "average_rate":(cst/2)
                                    })
                        
                        
                        if doc.warehouse and doc.required_area:
                            if doc.warehouse_charges_item:
                                for cst in doc.warehouse_charges_item:
                                    if cst.charges == "Warehouse Space Rent":
                                        opportunity.append("warehouse_space_details",{"date_from":doc.booking_date,
                                                                            "warehouse":doc.customer_warehouse if doc.customer_warehouse else None,
                                                                            "booked_upto":doc.booked_upto,
                                                                            "rental_charges":"Warehouse Space Rent",
                                                                            "uom":doc.uom,
                                                                            "cargo_type":doc.cargo_type,
                                                                            "required_area":doc.required_area,
                                                                            "no_of_days":doc.no_of_days,
                                                                            "rental_cost":cst.cost})
                        if doc.required_handling_services or doc.required_labour_service:
                            opportunity.append("warehouse_stock_items", {
                                "choose_handling_service": doc.required_handling_services if doc.required_handling_services else None,
                                "choose_labour_service": doc.required_labour_service if doc.required_labour_service else None
                            })
                        if doc.total_amount:
                            opportunity.payment_amount = doc.total_amount

                        # Append the opportunity_line_items list to the "opportunity" document
                        opportunity.extend("opportunity_line_item", opportunity_line_items)

                        # Save the "opportunity" document
                        opportunity.save()


                    




                    else: 
                    
                        customer=frappe.new_doc("Customer")
                        customer.customer_name=lead_doc.lead_name
                        customer.mobile_number=lead_doc.mobile_number
                        if lead_doc.email_id:
                            customer.email=lead_doc.email_id


                        customer.customer_group="Individual"
                        customer.territory="Rest Of The World"
                        if lead_doc.name:
                            customer.lead_name=lead_doc.name
                        
                        if lead_doc.address_link:
                            address=frappe.get_doc("Address",lead_doc.address_link)
                            if address.address_title:
                                customer.address_title=address.address_title
                            else:
                                customer.address_title="Home"
                            if address.address_line1:
                                customer.address_line1=address.address_line1
                            else:
                                customer.address_line1="NIL"
                            
                            if address.address_line2:
                                customer.address_line2=address.address_line2
                            else:
                                customer.address_line2="NIL"
                            if address.city:
                                customer.city=address.city
                            else:
                                customer.city="NIL"
                            
                        else:


                            if lead_doc.address_title:
                                customer.address_title=lead_doc.address_title
                            else:
                                customer.address_title="Home"
                            if lead_doc.address_line1:
                                customer.address_line1=lead_doc.address_line1
                            else:
                                customer.address_line1="NIL"
                            
                            if lead_doc.address_line2:
                                customer.address_line2=lead_doc.address_line2
                            else:
                                customer.address_line2="NIL"
                            if lead_doc.city:
                                customer.city=lead_doc.city
                            else:
                                customer.city="NIL"

                        if lead_doc.add_select_tariff:
                            customer.tariff = lead_doc.add_select_tariff
                        customer.insert()
                        print(customer.name)
                        customerr=frappe.get_doc("Customer",customer.name)
                        print(customerr)
                    
                        opportunity = frappe.new_doc("Opportunity")
                        opportunity.party_name = customer.customer_name
                        opportunity.booking_type = lead_doc.booking_type
                        current_date = today()
                        opportunity.booking_date = current_date
                        opportunity.lead_id = lead_doc.name
                        if lead_doc.vehicle_type:
                            opportunity.vehicle_type = lead_doc.vehicle_type

                        receiver_info_data = []  # Define a list to hold receiver information data
                        if doc.transit_details_item:
                            for transit in doc.transit_details_item:
                                receiver_info_data.append(
                                    {"transit_type": transit.transit_type, "zone": transit.zone}
                                )
                                # You can add more data as needed for each transit item

                            # Loop through the data and append it to the "receiver_information" list
                            for info in receiver_info_data:
                                opportunity.append("receiver_information", info)

                        charge_info_data = []  # Define a list to hold transit charges data
                        if doc.transit_charges_item:
                            for charge in doc.transit_charges_item:
                                charge_info_data.append(
                                    {"charges": charge.charges, "description": charge.description, "quantity": 1, "cost": charge.cost}
                                )

                            # Loop through the data and append it to the "transit_charges" list
                            for info in charge_info_data:
                                opportunity.append("transit_charges", info)
                        if doc.warehouse_charges_item:
                            war_info_data = []  # Define a list to hold transit charges data
                            for war in doc.warehouse_charges_item:
                                war_info_data.append(
                                    {"charges": war.charges, "quantity": 1, "cost": war.cost}
                                )
                            # Loop through the data and append it to the "transit_charges" list
                            for info in war_info_data:
                                opportunity.append("warehouse_charges", info)
                            # frappe.throw("LLLLLLll")
                        if doc.shipment_details:
                            shipment_item = []
                            for shipment in doc.shipment_details:
                                shipment_item.append(
                                    {"item":shipment.item,"quantity":shipment.quantity,"weight":shipment.weight,"packaging_type":shipment.packaging_type}
                                )
                            for ship in shipment_item:
                                opportunity.append("shipment_details", ship)

                        line_itms = []

                        # Initialize the opportunity_line_items list to store the aggregated data
                        opportunity_line_items = []
                        if doc.transit_charges_item:

                            # Loop through the transit_charges_item
                            for i in doc.transit_charges_item:
                                qty = 0
                                cst = 0

                                # Check if i.charge is not in line_itms
                                if i.charges not in line_itms:
                                    line_itms.append(i.charges)

                                    # Iterate through the items again to aggregate values for the same charge
                                    for j in doc.transit_charges_item:
                                        if i.charges == j.charges:
                                            qty += j.quantity
                                            cst += j.cost

                                    print(qty, cst, "*************", line_itms)

                                    # Append the aggregated data to the opportunity_line_items list
                                    opportunity_line_items.append({
                                        "item": i.charges,
                                        "quantity": qty,
                                        "amount": cst,
                                        "average_rate":(cst/2)
                                    })
                        if doc.warehouse_charges_item:
                            # Loop through the transit_charges_item
                            for i in doc.warehouse_charges_item:
                                qty = 0
                                cst = 0

                                # Check if i.charge is not in line_itms
                                if i.charges not in line_itms:
                                    line_itms.append(i.charges)

                                    # Iterate through the items again to aggregate values for the same charge
                                    for j in doc.warehouse_charges_item:
                                        if i.charges == j.charges:
                                            qty += j.quantity
                                            cst += j.cost

                                    print(qty, cst, "*************", line_itms)

                                    # Append the aggregated data to the opportunity_line_items list
                                    opportunity_line_items.append({
                                        "item": i.charges,
                                        "quantity": qty,
                                        "amount": cst,
                                        "average_rate":(cst/2)
                                    })
                        if doc.warehouse and doc.required_area:
                            if doc.warehouse_charges_item:
                                for cst in doc.warehouse_charges_item:
                                    if cst.charges == b_type.item:
                                        opportunity.append("warehouse_space_details",{"date_from":doc.booking_date,
                                                                            "booked_upto":doc.booked_upto,
                                                                            "warehouse":doc.customer_warehouse if doc.customer_warehouse else None,
                                                                            "rental_charges":"Warehouse Space Rent",
                                                                            "uom":doc.uom,
                                                                            "cargo_type":doc.cargo_type,
                                                                            "required_area":doc.required_area,
                                                                            "no_of_days":doc.no_of_days,
                                                                            "rental_cost":cst.cost})
                        if doc.required_handling_services or doc.required_labour_service:
                            opportunity.append("warehouse_stock_items", {
                                "choose_handling_service": doc.required_handling_services if doc.required_handling_services else None,
                                "choose_labour_service": doc.required_labour_service if doc.required_labour_service else None
                            })

                                
                        if doc.total_amount:
                            opportunity.payment_amount = doc.total_amount

                        # Append the opportunity_line_items list to the "opportunity" document
                        opportunity.extend("opportunity_line_item", opportunity_line_items)

                        # Save the "opportunity" document
                        opportunity.save()
                        frappe.msgprint("Opportunity Created Successfully")



@frappe.whitelist()
def service_charge (service,qty):
  
    print(service,qty)  
    data = {}
    if frappe.db.exists("Tariff Details",{"is_standard":1}) :
        tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
        if tariff.additional_services:
            for add in tariff.additional_services:
                if service == add.additional_service:
                    print(add.rate)
                    data["rate"] = add.rate
                    amount = int(qty) * add.rate
                    data["amount"] = amount
    return data

    
    


@frappe.whitelist()
def get_location(doc):
   print(doc)
   data={}
   lead_doc=frappe.get_doc("Lead",doc)
   print(lead_doc)
   if lead_doc.from_location:
       data["from"]=lead_doc.from_location
   if lead_doc.to_location:
       data["to"]=lead_doc.to_location
   return data


import json
@frappe.whitelist()
def calculate_transportation_cost(zone, vehicle_type,booking_type):
    zone_list = json.loads(zone)
    print(zone_list,"@@@@@@@@@@@@")
    amount = 0
    data ={}
    if booking_type:
        if frappe.db.exists("Booking Type",booking_type):
            b_type = frappe.get_doc("Booking Type",booking_type)
            if b_type.item :
                data["bill_item"] = b_type.item


    # if len(zone_list) != 2:
    #     return 0  # Return 0 if it's not a pair



    if frappe.db.exists("Tariff Details", {"is_standard": 1}):
        tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
        for item in tariff.tariff_details_item:
            if item.from_city == zone_list[0] and item.to_city == zone_list[1] and item.vehicle_type == vehicle_type:
                data["amount"] = item.amount
            elif item.from_city == zone_list[1] and item.to_city == zone_list[0] and item.vehicle_type == vehicle_type:
                data["amount"] = item.amount
    print(amount,"$$$$$$$$$$$$")
    return data 



from datetime import datetime
import calendar
@frappe.whitelist()
def calculate_rental_cost(booked_upto,uom,cargo_type,required_area,booking_date,booking_type):
  
    data={}
    current_date = datetime.strptime(booking_date, "%Y-%m-%d")
    print(booked_upto,"kkkkk")
    booked_upto_date=datetime.strptime(booked_upto, "%Y-%m-%d")
    print(booked_upto_date,"kkkkk")
    if booking_type:
        if frappe.db.exists("Booking Type",booking_type):
            b_type = frappe.get_doc("Booking Type",booking_type)
            if b_type.item :
                data["bill_item"] = b_type.item


    # Extract year and month from the datetime object
    year = current_date.year
    month = current_date.month
    # Calculate the last day of the month
    _, last_day = calendar.monthrange(year, month)
    # Create a new date object for the end of the month
    end_of_month = current_date.replace(day=last_day)
    if booked_upto_date>end_of_month:
        # Convert the end_of_month back to a string if needed
        end_of_month_str = end_of_month.strftime("%Y-%m-%d")
        data["end_month"]=end_of_month_str
        days_difference = (end_of_month - current_date).days
        data["difference"]=days_difference
        print(end_of_month_str,days_difference,"99999999999999")
    else:
        end_of_month_str = end_of_month.strftime("%Y-%m-%d")
        print(end_of_month)
        data["end_month"]=end_of_month_str
        days_difference = (booked_upto_date - current_date).days
        data["difference"]=days_difference
        print(days_difference,"ppppppp")

    no_of_days = float(days_difference)
    print(no_of_days,"@@@@@@@@@@@@2")
       
      
    if frappe.db.exists("Tariff Details",{"is_standard":1}):
                tariff=frappe.get_doc("Tariff Details",{"is_standard":1})
                if tariff.warehouse_space_rent_charges:
            
                    for itm in tariff.warehouse_space_rent_charges:
                        rate=0
                        if cargo_type == itm.cargo_type and uom == "Cubic Meter":
                            if no_of_days >= 30:
                                rate = itm.rate_per_month
                            
                            else:
                                    ratemonth= itm.rate_per_month
                                    rate=(ratemonth/30)
                                    print(rate)


                            total_amount = (rate * no_of_days) * float(required_area)
                            data["total_amount"] = total_amount


                        if uom == itm.uom:
                            if no_of_days >= 30:
                                rate = itm.rate_per_month
                            
                            else:
                                    ratemonth= itm.rate_per_month
                                    rate=(ratemonth/30)
                                    print(rate)


                            total_amount = (rate * no_of_days) * float(required_area)
                            data["total_amount"] = total_amount



                    return data
