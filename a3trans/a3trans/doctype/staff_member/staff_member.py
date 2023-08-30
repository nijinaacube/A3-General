# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class StaffMember(Document):
	def validate(self):
		if self.employee:
			employee=frappe.get_doc("Employee",self.employee)
			if employee.staff==0:
				employee.staff=1
				employee.save()

