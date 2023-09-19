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
@frappe.whitelist()
def convert(doc):
    lead_doc=frappe.get_doc("Lead",doc)
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
   
    return customer.as_dict()


   



