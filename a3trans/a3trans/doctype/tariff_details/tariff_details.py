# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document


class TariffDetails(Document):
    pass

    # def after_insert(self):
    #     if self.customer and self.is_standard==0:
    #         customer=frappe.get_doc("Customer",self.customer)
    #         customer.tariff=self.name
    #         customer.save()
            




from frappe import whitelist, get_all, get_doc         
@frappe.whitelist()
def get_contact(doc):
   lead=frappe.get_doc("Lead",doc)
   linked_contact = get_all('Dynamic Link', filters={
       'link_doctype': 'Lead',
       'link_name': doc,
       'parenttype': 'Contact'
   }, fields=['parent'])
   print(linked_contact)
   contact_names = [contact.parent for contact in linked_contact]
   return contact_names


# @frappe.whitelist()
# def get_standard(std):
#     if std == "1":
#         if frappe.db.exists("Tariff Details",{"is_standard":1}):
#             frappe.throw("You have already set one standard tariff. You can't create another standard tariff")
        
        