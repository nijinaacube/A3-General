import frappe
def after_insert(doc,method):
# Check if the contact exists, if not create it
	if not frappe.db.exists("Contact", {"first_name":doc.customer_name, "mobile_no":doc.mobile_number}):
		contact = frappe.new_doc("Contact")
		print("hiii")
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
		frappe.throw("Same mobile number is already registered.")
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

		address.address_type="Billing"
		address.append("links", {
			"link_doctype": "Customer",
			"link_name": doc.name,
			"link_title": doc.name,
		})
		address.insert()
		if address.name:
			doc.customer_primary_address=address.name
		if contact.name:
			doc.customer_primary_contact = contact.name
		doc.save()


	   # Create a lead        
	lead = frappe.new_doc("Lead")        
	if doc.customer_type=="Individual":            
		if doc.gender:                
			lead.gender=doc.gender            
		if doc.customer_name:                
			lead.lead_name=doc.customer_name        
	else:            
		lead.company_name= doc.customer_name        
		if doc.address_title:            
			lead.address_title=doc.address_title        
		if doc.address_line1:            
			lead.address_line1=doc.address_line1        
		if doc.address_line2:            
			lead.address_line2=doc.address_line2        
		if doc.city:            
			lead.city=doc.city        
		if doc.zip_code:            
			lead.pincode=doc.zip_code        
		if doc.mobile_number:            
			lead.mobile_no = doc.mobile_number        
		if doc.email:            
			lead.email_id = doc.email        
		if doc.territory:            
			lead.country=doc.territory        
		lead.save()