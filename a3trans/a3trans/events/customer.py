import frappe

def after_insert(doc,method):
    if doc.email:
        
        if frappe.db.exists("Address",{"email_id":doc.email}):
        
            address = frappe.get_doc("Address",{"email_id":doc.email})
            for link in address.links:
                
                link.link_doctype = "Customer"
                link.link_name = doc.name
            address.save()
        

    if doc.lead_name:
        lead=frappe.get_doc("Lead",doc.lead_name)
        print(lead.add_select_tariff,"llllllllll")
        if lead.add_select_tariff:   
            new_tariff = frappe.new_doc("Tariff Details")
            new_tariff.parent_tariff = lead.add_select_tariff
            new_tariff.customer = doc.name
            parent_tariff = frappe.get_doc("Tariff Details", lead.add_select_tariff )
            if parent_tariff.tariff_details_item:
                for parent_transit in parent_tariff.tariff_details_item:
                    if lead.transit_charges_item:
                        for add in lead.transit_charges_item:

                            if ((parent_transit.from_city == add.from_location and parent_transit.to_city == add.to) or
                                            (parent_transit.from_city == add.to and parent_transit.to_city == add.from_location)) and \
                                            parent_transit.vehicle_type == add.vehicle_type:
                                if parent_transit.amount != add.cost:
                                    new_tariff.append("tariff_details_item",{
                                        "from_city":add.from_location,
                                        "to_city":add.to,
                                        "vehicle_type":add.vehicle_type,
                                        "amount":add.cost
                                    }) 
            if parent_tariff.additional_services:
                for parent_service in parent_tariff.additional_services:
                    if lead.additional_services:
                        for add_service in lead.additional_services:
                                if add_service.additional_service:
                                        if  add_service.additional_service == parent_service.additional_service:
                                            if add_service.rate != parent_service.amount:
                                                new_tariff.append("additional_services",
                                                    {
                                                    "additional_service":add_service.additional_service,
                                                    "quantity":1,
                                                    "amount":add_service.rate
                                                    }
                                                )
                                                
            new_tariff.save()
            if frappe.db.exists("Tariff Details",{"customer":doc.name}):
                tar = frappe.get_doc("Tariff Details",{"customer":doc.name})
                doc.tariff = tar.name
    else:
        if doc.tariff:
            new_tariff = frappe.new_doc("Tariff Details")
            new_tariff.parent_tariff = doc.tariff
            new_tariff.customer = doc.name
            new_tariff.save()
            if frappe.db.exists("Tariff Details",{"customer":doc.name}):
                tar = frappe.get_doc("Tariff Details",{"customer":doc.name})
                doc.tariff = tar.name


                                    

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







  


      


