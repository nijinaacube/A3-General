import frappe
def after_insert(doc,method):
   
   if doc.lead_name:
       lead=frappe.get_doc("Lead",doc.lead_name)
       print(lead.add_select_tariff,"llllllllll")
      
       if lead.add_select_tariff:      
           doc.tariff=lead.add_select_tariff
           tariff_doc= frappe.get_doc("Tariff Details",lead.add_select_tariff)
           print(tariff_doc)
           tariff_doc.customer=doc.name
           tariff_doc.save()




# Check if the contact exists, if not create it
   if not frappe.db.exists("Contact", {"first_name":doc.customer_name, "mobile_no":doc.mobile_number}):
       contact = frappe.new_doc("Contact")
       
       contact.first_name = doc.customer_name
       if doc.email:
           contact.append("email_ids", {
           "email_id": doc.email,
           "is_primary": 1,
       })
       contact.append("phone_nos", {
           "phone": doc.mobile_number,
           "is_primary_phone": 1,
           "is_primary_mobile_no": 1,
       })
       contact.append("links", {
           "link_doctype": "Customer",
           "link_name": doc.name,
           "link_title": doc.name,
       })
      
       contact.insert()
   else:
       contact=frappe.get_doc("Contact",{"mobile_no":doc.mobile_number})
   # else:
   #   frappe.throw("Same mobile number is already registered.")
# Create an address document
   if not frappe.db.exists("Address", {"phone":doc.mobile_number}):
  
       address=frappe.new_doc("Address")
       if doc.address_title:
           address.address_title=doc.address_title
       if doc.address_line1:
           address.address_line1=doc.address_line1
       else: 
           address.address_line1="NIL"
       if doc.address_line2:
           address.address_line2=doc.address_line2
       else:
           address.address_line2="NIL"
       if doc.city:
           address.city=doc.city
       else:
           address.city="NIL"
      
       if doc.zip_code:
           address.pincode=doc.zip_code
       else:
           address.pincode="NIL"
       if doc.email:
           address.email_id=doc.email
       if doc.mobile_number:
           address.phone=doc.mobile_number
       address.country="United Arab Emirates"
       address.address_type="Billing"
       address.append("links", {
           "link_doctype": "Customer",
           "link_name": doc.name,
           "link_title": doc.name,
       })
       address.insert()
   else:
       address=frappe.get_doc("Address",{"phone":doc.mobile_number})
      
   if address.name:
       doc.customer_primary_address=address.name
   if contact.name:
       doc.customer_primary_contact = contact.name
   doc.save()







  


      


