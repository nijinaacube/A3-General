import frappe
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
   if lead_doc.contact_by:
       print("hii")
       
       
@frappe.whitelist()
def convert(doc):
   lead_doc=frappe.get_doc("Lead",doc)
   if lead_doc.address_link == None or lead_doc.address_link == "" :
       frappe.throw("Please add Address details in Lead " f'<a href="/app/lead/{lead_doc.name}" target="blank">{lead_doc.name} </a>')
#    if lead_doc.add_select_tariff== None:
#        frappe.throw("Please add/Select Tariff details in Lead " f'<a href="/app/lead/{lead_doc.name}" target="blank">{lead_doc.name} </a>')


   else:


       if frappe.db.exists("Customer",{"mobile_number":lead_doc.mobile_number}):
           customer=frappe.get_doc("Customer",{"mobile_number":lead_doc.mobile_number})


       else: 
      
           customer=frappe.new_doc("Customer")
           customer.customer_name=lead_doc.lead_name
           customer.mobile_number=lead_doc.mobile_number
           if lead_doc.email_id:
               customer.email=lead_doc.email_id


           customer.customer_group="Individual"
           customer.territory="India"
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


           customer.insert()
       print(customer.name)
       customerr=frappe.get_doc("Customer",customer.name)
       print(customerr)
 
       return customer.as_dict()




 




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


