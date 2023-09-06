import frappe
from datetime import date

from frappe.utils import add_to_date
def after_insert(doc,method):
	if doc.opportunity_from=="Customer":
		if doc.party_name:
			
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
				
				sales_order.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
			if doc.booking_type=="Packing and Moving":
				for packing in doc.packing_items:
					sales_order.append("items",{"item_code":packing.item_name,"qty":1,"rate":doc.payment_amount})			
			sales_order.save()
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
				
				sales_invoice.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
			if doc.booking_type=="Packing and Moving":
				for packing in doc.packing_items:
					sales_invoice.append("items",{"item_code":packing.item_name,"qty":1,"rate":doc.payment_amount})
		
			sales_invoice.save()
			sales_invoice.submit()
			doc.invoice_id = sales_invoice.name

# 			Create payment entry
			if doc.customer_group != "Credit Customer":
				payment=frappe.new_doc("Payment Entry")
				payment.party_type="Customer"
				payment.party=doc.party_name
				payment.party_name=doc.customer_name
				payment.order_id=doc.name
				payment.booking_type=doc.booking_type
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
			




			linked_addresses = frappe.get_all('Dynamic Link', filters={
				'link_doctype': 'Customer',
				'link_name': doc.party_name,
				'parenttype': 'Address'
			}, fields=['parent'])

			# Getting the Address docs and storing them with phone as the key.
			# I'm assuming 'phone' (from info.contact) is the field in the Address DocType that is supposed to be unique.
			existing_addresses = {address_doc.phone: address_doc for address_doc in [frappe.get_doc('Address', address.parent) for address in linked_addresses]}

			for info in doc.receiver_information:
				# Checking if the current info.contact exists as a phone in the existing_addresses
				if info.contact not in existing_addresses:
					address = frappe.new_doc("Address")
					if info.name1:
						address.address_title = info.name1
					if info.address_line1:
						address.address_line1 = info.address_line1
					if info.address_line2:
						address.address_line2 = info.address_line2
					if info.city:
						address.city = info.city
					if info.latitude:
						address.latitude = info.latitude
					if info.longitude:
						address.longitude = info.longitude
					if info.contact:
						address.phone = info.contact
					if info.email:
						address.email_id = info.email

					address.address_type = "Shipping"
					address.append("links", {
						"link_doctype": "Customer",
						"link_name": doc.party_name
					})
					address.insert()



			if doc.booking_type == "Warehouse":
			
				for war in doc.warehouse_space_details:
					for itm in doc.warehouse_stock_items:
						if war.warehouse:
							warehouses = frappe.get_doc("Warehouse", war.warehouse)
							warehouses.append("warehouse_item",{"booking_id":doc.name,"item":itm.item,"quantity":itm.quantity,"floor_id":war.floor_id,"shelf_id":war.shelf_id,"rack_id":war.rack_id,"status":"Pending"})		
							warehouses.save()

						# if doc.party_name:
						# 	customer=frappe.get_doc("Customer",doc.party_name)
						# 	print(customer)
						# 	fromdate=frappe.utils.nowdate()
						# 	dur=int(war.duration)
						# 	todate=add_to_date(fromdate,days=dur,as_string=True)	
						# 	table_len=len(customer.customer_warehouse_details)                            
						# 	if table_len ==0:                                
						# 		customer.append("customer_warehouse_details",{"warehouse":war.warehouse,"from":fromdate,"to":todate})                            
						# 	else:                                
						# 		for warehouses_det in customer.customer_warehouse_details:                                    
						# 			if  war.warehouse not in warehouses_det.warehouse:                                        
						# 				customer.append("customer_warehouse_details",{"warehouse":war.warehouse,"from":fromdate,"to":todate})                            
						# 	customer.save()	
							
						
			
			
					

		



#API
			
@frappe.whitelist()
def get_addresses(doc,type):
	print(doc)
	data=[]
	linked_addresses = frappe.get_all('Dynamic Link', filters={
					'link_doctype': 'Customer',
					'link_name': doc,
					'parenttype': 'Address'
				}, fields=['parent'])
	addresses = [frappe.get_doc('Address', address.parent) for address in linked_addresses]
	data.append(addresses)
	# if type=="Warehouse":
	# 	customer=frappe.get_doc("Customer",doc)
	# 	if customer.customer_warehouse_details:
	# 		for details in customer.customer_warehouse_details:
	# 			data.append(details)

	# print(data)
	return data 
@frappe.whitelist()
def get_sender_data(mobile_number):
	print(mobile_number)
	if frappe.db.exists("Customer", { "mobile_number": mobile_number}):
		customer = frappe.get_doc("Customer", {"mobile_number": mobile_number})
		return customer.as_dict()
	else:
		pass

@frappe.whitelist()
def get_warehouse(doc):
    if frappe.db.exists("Warehouse", {"customer": doc}):
        warehouses = frappe.get_list("Warehouse", fields=["name"], filters={"customer": doc})
        return [d.name for d in warehouses]
    else:
        return []

		








				




				

			
