import frappe

def after_insert(doc, method):
    if doc.links:
        for link in doc.links:
            if link.link_doctype == "Lead" and link.link_name:
                lead = frappe.get_doc("Lead", link.link_name)
                print(lead)
                
                lead.address_link = doc.name
                lead.save()
def validate(doc, method):
    if doc.links:
       
        for link in doc.links:
            if link.link_doctype == "Lead" and link.link_name:
                lead = frappe.get_doc("Lead", link.link_name)
                print(lead)
                if lead.mobile_number:
                    doc.phone=lead.mobile_number
                lead.address_link = doc.name
                lead.save()