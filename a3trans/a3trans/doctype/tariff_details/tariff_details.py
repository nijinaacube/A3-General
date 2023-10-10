# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document


class TariffDetails(Document):
   def validate(self):
       if self.customer:
           self.is_standard=0
       if self.is_standard==1:
           self.customer=""
      
   # def after_insert(self):
   #   if self.customer and self.is_standard==0:
   #       customer=frappe.get_doc("Customer",self.customer)
   #       customer.tariff=self.name
   #       customer.save()




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

