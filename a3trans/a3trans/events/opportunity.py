import frappe
from datetime import date

def after_insert(doc,method):
	if doc.opportunity_from=="Customer":
		if doc.party_name:
			customer=frappe.get_doc("Customer",doc.party_name)
			#Create sales order
			sales_order=frappe.new_doc("Sales Order")
			sales_order.customer = doc.party_name
			sales_order.customer_name = doc.customer_name	
			sales_order.booking_id=doc.name
			sales_order.booking_type=doc.booking_type
			sales_order.booking_status="New"
			sales_order.delivery_date = date.today()
			if doc.booking_type=="Vehicle" or doc.booking_type=="Warehouse":
				for shipment in doc.shipment_details:
					sales_order.append("items",{"item_code":shipment.item,"qty":1,"rate":doc.payment_amount})
			if doc.booking_type=="Diesel":
				for shipment in doc.shipment_details:
					sales_order.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
			if doc.booking_type=="Packing and Moving":
				for packing in doc.packing_items:
					sales_order.append("items",{"item_code":packing.item,"qty":1,"rate":doc.payment_amount})			
			sales_order.insert()
			sales_order.submit()


			# Create sales invoice
			sales_invoice=frappe.new_doc("Sales Invoice")
			sales_invoice.customer = doc.party_name
			sales_invoice.customer_name = doc.customer_name
			sales_invoice.order_id=doc.name
			sales_invoice.booking_type=doc.booking_type
			sales_invoice.order_status="New"
			sales_invoice.due_date=date.today()
			if doc.booking_type=="Vehicle" or doc.booking_type=="Warehouse":
				for shipment in doc.shipment_details:
					sales_invoice.append("items",{"item_code":shipment.item,"qty":1,"rate":doc.payment_amount})
			if doc.booking_type=="Diesel":
				for shipment in doc.shipment_details:
					sales_invoice.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
			if doc.booking_type=="Packing and Moving":
				for packing in doc.packing_items:
					sales_invoice.append("items",{"item_code":packing.item,"qty":1,"rate":doc.payment_amount})
		
			sales_invoice.save()
			sales_invoice.submit()
			doc.invoice_id = sales_invoice.name

# 			Create payment entry
			if doc.customer_group != "Credit Customer":
				payment=frappe.new_doc("Payment Entry")
				payment.party_type="Customer"
				payment.party=doc.party_name
				payment.party_name=doc.customer_name
				if sales_order.company:
					company=frappe.get_doc("Company",sales_order.company)
					print(company)
					payment.paid_from=company.default_receivable_account
					payment.paid_to=company.default_cash_account
				payment.paid_to_account_currency=company.default_currency
				payment.paid_from_account_currency=company.default_currency
				payment.payment_type="Receive"
				payment.mode_of_payment=doc.mode_of_payment
				current_date=date.today()			
				payment.reference_date=current_date
				payment.total_allocated_amount=doc.payment_amount
				payment.paid_amount=doc.payment_amount
				payment.received_amount=doc.payment_amount	
				payment.append("references",{"reference_doctype":"Sales Invoice","reference_name":doc.invoice_id,"total_amount":doc.payment_amount,"allocated_amount":doc.payment_amount,"outstanding_amount":doc.payment_amount})
				payment.insert()	
				payment.submit()
				doc.payment_id=payment.name
				doc.status="Converted"
				doc.save()
			#Create user account for sender
			if doc.mobile_number and doc.email:
				if not frappe.db.exists("User", {"first_name":doc.customer_name, "mobile_no":doc.mobile_number,"email":doc.email}):
					user = frappe.get_doc(
						{
							"doctype": "User",
							"mobile_no": doc.mobile_number,
							"user.phone" : doc.mobile_number,
							"first_name":doc.customer_name,

							
							
							"email":doc.email,
							"enabled": 1,	
							"role_profile_name":"Logistic Customer",
							"user_type": "Website User",
							"send_welcome_email":0
						}
					)
					user.flags.ignore_permissions = True
					user.flags.ignore_password_policy = True
					user.insert()
					frappe.msgprint('User ' f'<a href="/app/user/{user.name}" target="blank">{user.name} </a> Created Successfully ')
			