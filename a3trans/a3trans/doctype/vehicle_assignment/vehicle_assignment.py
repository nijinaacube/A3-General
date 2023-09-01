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
		if self.vehicle_id:
			vehicle=frappe.get_doc("Vehicle",self.vehicle_id)
			if vehicle.vehicle_status=="Available":
				vehicle.vehicle_status="On Duty"
				vehicle.save()

		if self.routes:
			for order in self.routes:
				if order.order_id:
					opportunity = frappe.get_doc("Opportunity", order.order_id)
					if self.vehicle_id:
						vehicle=frappe.get_doc("Vehicle",self.vehicle_id)
						for type in vehicle.allowed_booking_type:
							if opportunity.booking_type in  type.booking_type:
								pass
							else:
								frappe.throw("You are not allowed to choose the vehicle for this booking.")

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
					
					sales_order.save()
					sales_invoice.save()
	def after_insert(self):
		if self.routes:
			for order in self.routes:
				if order.order_id:
					opportunity = frappe.get_doc("Opportunity", order.order_id)
					if self.vehicle_id:
						opportunity.vehicle=self.vehicle_id
					if self.make:
						opportunity.make=self.make
					if self.model:
						opportunity.model=self.model
					if self.driver_id:
						opportunity.driver=self.driver_id
					if self.driver_name:
						opportunity.driver_name=self.driver_name
					if self.mobile_number:
						opportunity.driver_phone_number=self.mobile_number
					if self.helper_id:
						opportunity.helper=self.helper_id
					if self.helper_name:
						opportunity.helper_name=self.helper_name
					if self.phone_number:
						opportunity.helper_phone_number=self.phone_number
					opportunity.save()
