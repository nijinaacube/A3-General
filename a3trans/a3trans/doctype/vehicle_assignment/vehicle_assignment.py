# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document

class VehicleAssignment(Document):
	def validate(self):
		if self.driver_id:
			driver=frappe.get_doc("Staff Member",self.driver_id)
			if driver.status=="Available":
				driver.status="On Duty"
				driver.save()
		if self.helper_id:
			helper=frappe.get_doc("Staff Member",self.helper_id)
			if helper.status=="Available":
				helper.status="On Duty"
				helper.save()



		if self.routes:
			for order in self.routes:
				if order.order_id:
					opportunity = frappe.get_doc("Opportunity", order.order_id)
					sales_order = frappe.get_doc("Sales Order", {"booking_id": opportunity.name})
					sales_invoice = frappe.get_doc("Sales Invoice", {"order_id": opportunity.name})
					
					if self.assignment_status == "Vehicle Assigned":
						opportunity.order_status = "Vehicle Assigned"
						sales_order.booking_status = "Vehicle Assigned"
						sales_invoice.order_status = "Vehicle Assigned"
					elif self.assignment_status == "In-Transit":
						opportunity.order_status = "In-Transit"
						sales_order.booking_status = "In-Transit"
						sales_invoice.order_status = "In-Transit"
					elif self.assignment_status == "Arrived":
						opportunity.order_status = "Arrived"
						sales_order.booking_status = "Arrived"
						sales_invoice.order_status = "Arrived"
					elif self.assignment_status == "Delivered":
						opportunity.order_status = "Delivered"
						sales_order.booking_status = "Delivered"
						sales_invoice.order_status = "Delivered"
					elif self.assignment_status == "Closed":
						opportunity.order_status = "Closed"
						sales_order.booking_status = "Closed"
						sales_invoice.order_status = "Closed"
					opportunity.status="Converted"
					opportunity.save()
					sales_order.save()
					sales_invoice.save()
