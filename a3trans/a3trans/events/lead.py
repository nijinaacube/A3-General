import frappe
import datetime
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
   lead_doc=doc

  

   if lead_doc.status=="Opportunity":
        if lead_doc.contact_by == "" or lead_doc.contact_by == None:
            frappe.throw("Please Assign this lead to a Staff for further follow-up")
        if lead_doc.address_link == "" or lead_doc.address_link == None:
            frappe.throw("Please add Biling Address")
      
        if frappe.db.exists("Customer",{"mobile_number":lead_doc.mobile_number}):
            customer=frappe.get_doc("Customer",{"mobile_number":lead_doc.mobile_number})
            opportunity=frappe.new_doc("Opportunity")
            opportunity.party_name=customer.customer_name
            opportunity.booking_type=lead_doc.booking_type
            opportunity.lead_id=lead_doc.name
            if lead_doc.add_select_tariff:
                customer.tariff = lead_doc.add_select_tariff
                customer.insert()
             # Define a list of receiver information data
            # receiver_info_data = [
            #     {"order_no":1,"transit_type": "Pickup", "zone": lead_doc.from_location},
            #     {"order_no":2,"transit_type": "Dropoff", "zone": lead_doc.to_location},
            #     # Add more data as needed
            # ]

            # # Loop through the data and append it to the "receiver_information" list
            # for info in receiver_info_data:
            #     opportunity.append("receiver_information", info)
         
            
            opportunity.save()
            frappe.msgprint("Opportunity Created Successfully")


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
        
            opportunity=frappe.new_doc("Opportunity")
            opportunity.party_name=customer.customer_name
            opportunity.booking_type=lead_doc.booking_type
            opportunity.booking_date=datetime.date.today()
            opportunity.lead_id=lead_doc.name
             # Define a list of receiver information data
            # receiver_info_data = [
            #     {"order_no":1,"transit_type": "Pickup", "zone": lead_doc.from_location},
            #     {"order_no":2,"transit_type": "Dropoff", "zone": lead_doc.to_location},
                
            # ]

            # # Loop through the data and append it to the "receiver_information" list
            # for info in receiver_info_data:
            #     opportunity.append("receiver_information", info)
         
            opportunity.save()
            frappe.msgprint("Opportunity Created Successfully")
         


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
def calculate_transportation_cost(zone, vehicle_type, length):
    zone_list = json.loads(zone)
    amount = 0


    if len(zone_list) != 2:
        return 0  # Return 0 if it's not a pair



    if frappe.db.exists("Tariff Details", {"is_standard": 1}):
        tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
        for item in tariff.tariff_details_item:
            if item.from_city == zone_list[0] and item.to_city == zone_list[1] and item.vehicle_type == vehicle_type:
                amount = item.amount
            elif item.from_city == zone_list[1] and item.to_city == zone_list[0] and item.vehicle_type == vehicle_type:
                amount = item.amount
    print(amount,"$$$$$$$$$$$$")
    return amount 
