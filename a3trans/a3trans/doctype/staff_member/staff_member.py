# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class StaffMember(Document):
	def validate(self):
		if self.employee:
			employee=frappe.get_doc("Employee",self.employee)
			staff_list = frappe.get_all("Staff Member")
			for staff in staff_list:
				staff_member = frappe.get_doc("Staff Member",staff.name)
				if self.employee == staff_member.employee:
					frappe.throw("The empoyee you have selected already added as a staff member")
			# if employee.staff==0:
			# 	employee.staff=1
			# 	employee.save()
			if self.role == "Driver":
				if employee.cell_number and employee.personal_email:
					
						if not frappe.db.exists("User", {"first_name":employee.first_name, "mobile_no":employee.cell_number,"email":employee.personal_email}):
							user = frappe.get_doc(
								{
									"doctype": "User",
									"mobile_no": employee.cell_number,
									"user.phone" : employee.cell_number,
									"first_name":employee.first_name,
				
				
									
									
									"email":employee.personal_email,
									"enabled": 1,  
									"role_profile_name":"Driver",
									"user_type": "Website User",
									"send_welcome_email":0
								}
							)
							user.flags.ignore_permissions = True
							user.flags.ignore_password_policy = True
							user.insert()
							frappe.msgprint('User ' f'<a href="/app/user/{user.name}" target="blank">{user.name} </a> Created Successfully ')

