# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class EmployeePerformanceEvaluation(Document):
	pass
@frappe.whitelist()
def get_employee(doc):
	print(doc)
	opp=frappe.get_doc("Opportunity",doc)
	va=frappe.get_doc("Vehicle Assignment",{"order":doc})
	data={}
	if opp.driver:
		staff=frappe.get_doc("Staff Member",opp.driver)
		data["employee"]=staff.employee
		data["va_id"]=va.name
		return data

	
         
        
 