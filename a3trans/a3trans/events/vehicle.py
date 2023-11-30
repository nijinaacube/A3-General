import frappe
def validate(doc,methods):
    vehicle_list = frappe.get_all("Vehicle")
    for veh in vehicle_list:
        vehicle = frappe.get_doc("Vehicle",veh.name)
        if vehicle.assigned_driver == doc.assigned_driver:
            frappe.throw("The selected driver is already assigned in other vehicle")
        if vehicle.assigned_helper == doc.assigned_helper:
            frappe.throw("The selected helper is already assigned in other vehicle")
