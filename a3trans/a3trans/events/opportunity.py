import frappe
from datetime import date
from datetime import date
from datetime import datetime
import calendar
from functools import reduce
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
			sales_order.delivery_date = frappe.utils.nowdate()
			if doc.booking_type=="Vehicle" or doc.booking_type=="Warehouse" :
				for shipment in doc.opportunity_line_item:
					sales_order.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
		
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
			sales_invoice.due_date=frappe.utils.nowdate()
			if doc.booking_type=="Vehicle" or doc.booking_type=="Warehouse" :
				for shipment in doc.opportunity_line_item:
					sales_invoice.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
			
			if doc.booking_type=="Diesel":
				
				sales_invoice.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
			if doc.booking_type=="Packing and Moving":
				for packing in doc.packing_items:
					sales_invoice.append("items",{"item_code":packing.item_name,"qty":1,"rate":doc.payment_amount})
		
			sales_invoice.insert()
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
				current_date=frappe.utils.nowdate()			
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
					if info.make_default ==1:
						address.is_default=1
					address.address_type = "Shipping"
					address.append("links", {
						"link_doctype": "Customer",
						"link_name": doc.party_name
					})
					address.address_type = "Shipping"
					
					address.append("links", {
						"link_doctype": "Customer",
						"link_name": doc.party_name
					})
					address.insert()
					


				elif info.address and info.make_default == 1:
					# Fetch the existing default address
					default_address = frappe.get_all('Address', filters={'is_default': 1, 'phone': info.contact}, fields=['name', 'is_default'])
					print(default_address)


					# If there's an existing default address, unset its default status
					if default_address:
						address_to_unset = frappe.get_doc('Address', default_address[0].name)
						address_to_unset.is_default = 0
						address_to_unset.save()
					add=frappe.get_doc("Address",info.address)
					add.address_type = "Shipping"
					
					add.append("links", {
						"link_doctype": "Customer",
						"link_name": doc.party_name
					})
					add.is_default=1
					add.insert()



				
				




			if doc.booking_type == "Warehouse":
			
				for war in doc.warehouse_space_details:
					for itm in doc.warehouse_stock_items:
						if war.warehouse:
							warehouses = frappe.get_doc("Warehouse", war.warehouse)
							warehouses.append("warehouse_item",{"booking_id":doc.name,"item":itm.item,"quantity":itm.quantity,"floor_id":war.floor_id,"shelf_id":war.shelf_id,"rack_id":war.rack_id,"zone":war.zone,"status":"Pending"})		
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
			
# @frappe.whitelist()
# def get_addresses(doc,type):
# 	print(doc)
	
	linked_addresses = frappe.get_all('Dynamic Link', filters={
					'link_doctype': 'Customer',
					'link_name': doc,
					'parenttype': 'Address'
				}, fields=['parent'])
	addresses = [frappe.get_doc('Address', address.parent) for address in linked_addresses]
	

# 	return addresses 
	# if type=="Warehouse":
	# 	customer=frappe.get_doc("Customer",doc)
	# 	if frappe.db.exists("Warehouse", {"customer": doc}):
	# 		details = frappe.get_list("Warehouse", fields=["name"], filters={"customer": doc})
	# 		data.append(details)
@frappe.whitelist()
def fetch_address(address):
	print(address)
	add=frappe.get_doc("Address",address)
	data={}
	if add.address_title:
		data["title"]=add.address_title
	if add.city:
		data["city"]= add.city
	if add.address_line1:
		data["address1"]=add.address_line1
	if add.address_line2:
		data["address2"]=add.address_line2

	if add.latitude:
		data["lat"]=add.latitude
	if add.longitude:
		data["lon"]=add.longitude
	if add.phone:
		data["phone"]=add.phone
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

		

@frappe.whitelist()
def fetch_warehouse(warehouse):
	print(warehouse)
	data={}
	warehouses=frappe.get_doc("Warehouse",warehouse)
	if warehouses.city:
		data["city"]= warehouses.city
	if warehouses.address_line_1:
		data["address1"]=warehouses.address_line_1
	if warehouses.address_line_2:
		data["address2"]=warehouses.address_line_2

	if warehouses.latitude:
		data["lat"]=warehouses.latitude
	if warehouses.longitude:
		data["lon"]=warehouses.longitude
	if warehouses.phone_no:
		data["phone"]=warehouses.phone_no
	return data

@frappe.whitelist()
def get_default_address(doc):
	# Fetch linked addresses
	linked_addresses = frappe.get_all('Dynamic Link', filters={
		'link_doctype': 'Customer',
		'link_name': doc,
		'parenttype': 'Address'
	}, fields=['parent'])

	# Fetch Address docs
	addresses = [frappe.get_doc('Address', address.parent) for address in linked_addresses]

	# Find default address
	default_address = None
	for address in addresses:
		if address.is_default == 1:
			default_address = address
			break
	print(default_address)
	if default_address != None:
	
		data={}
		if default_address.name:
			data["name"]=default_address.name
		if default_address.address_title:
			data["title"]=default_address.address_title
		if default_address.city:
			data["city"]= default_address.city
		if default_address.address_line1:
			data["address1"]=default_address.address_line1
		if default_address.address_line2:
			data["address2"]=default_address.address_line2

		if default_address.latitude:
			data["lat"]=default_address.latitude
		if default_address.longitude:
			data["lon"]=default_address.longitude
		if default_address.phone:
			data["phone"]=default_address.phone
		return data





from frappe import whitelist, get_all, get_doc

@frappe.whitelist()
def get_addresses(doc):
	# Fetch linked addresses
	linked_addresses = get_all('Dynamic Link', filters={
		'link_doctype': 'Customer',
		'link_name': doc,
		'parenttype': 'Address'
	}, fields=['parent'])

	# You may only need names of the addresses for the filter
	address_names = [address.parent for address in linked_addresses]
	return address_names


@frappe.whitelist()
def get_end_of_month(current_date_str):
   data={}
   current_date = datetime.strptime(current_date_str, "%Y-%m-%d")


   # Extract year and month from the datetime object
   year = current_date.year
   month = current_date.month


   # Calculate the last day of the month
   _, last_day = calendar.monthrange(year, month)


   # Create a new date object for the end of the month
   end_of_month = current_date.replace(day=last_day)
   # Convert the end_of_month back to a string if needed
   end_of_month_str = end_of_month.strftime("%Y-%m-%d")
   data["end_month"]=end_of_month_str
   days_difference = (end_of_month - current_date).days
   data["difference"]=days_difference
   print(end_of_month_str,days_difference)
   return data
@frappe.whitelist()
def calculate_charges(selected_item,no_of_days,uom,customer,area):
	no_of_days=float(no_of_days)
	print(selected_item,no_of_days)
	data={}
	if frappe.db.exists("Tariff Details",{"customer":customer}):
		tariff=frappe.get_doc("Tariff Details",{"customer":customer})
		for itm in tariff.warehouse_space_rent_charges:
			if uom==itm.uom:
				rate=itm.rate
		
				total_amount=(rate*no_of_days)*float(area)
				data["total_amount"]=total_amount
				return data
	else:
		frappe.msgprint("No Tariff Added for this customer")
	
	  
@frappe.whitelist()
def get_warehouse(doc):
	if frappe.db.exists("Warehouse", {"customer": doc}):
		warehouses = frappe.get_list("Warehouse", fields=["name"], filters={"customer": doc})
		return [d.name for d in warehouses]
	else:
		return []


				
	  
@frappe.whitelist()
def get_warehouse_data(doc):
	war=frappe.get_doc("Warehouse",doc)
	print(war)
	data={}
	if war.warehouse_floor:
		data["floor"]=war.warehouse_floor
	if war.zone:
		data["zone"]=war.zone
	if war.warehouse_shelf:
		data["shelf"]=war.warehouse_shelf
	if war.warehouse_rack:
		data["rack"]=war.warehouse_rack
	return data


@frappe.whitelist()
def fetch_charges_price(charges):
	print(charges)
	if frappe.db.exists("Item Price",{"item_code":charges}):
		itm=frappe.get_doc("Item Price",{"item_code":charges})
		print(itm)
		return itm.as_dict()


import json
@frappe.whitelist()

def calculate_transportation_cost(customer,zone,vehicle_type,length):
	print(length)
	zone_list = json.loads(zone)
	amount=0
	if frappe.db.exists("Tariff Details",{"customer":customer}):
		tariff=frappe.get_doc("Tariff Details",{"customer":customer})
		
		for item in tariff.tariff_details_item:
		
			if item.from_city==zone_list[0] and item.vehicle_type==vehicle_type:
				if item.to_city==zone_list[1]:
					print(item.amount)
					amount=item.amount
			




			
	return amount


@frappe.whitelist()
def create_stock_entry(doc):
	print(doc)
	opp=frappe.get_doc("Opportunity",doc)
	
	
	for stock in opp.warehouse_stock_items:
		if stock.movement_type=="Stock IN":
			stock_entry = frappe.new_doc('Stock Entry')
			stock_entry.party_name=opp.party_name
			stock_entry.order_id=opp.name
			stock_entry.stock_entry_type="Material Receipt"
			stock_entry.purpose="Material Receipt"
			for war in opp.warehouse_space_details:
				stock_entry.append("items",{"t_warehouse":war.warehouse,
							"item_code":stock.item,"qty":stock.quantity,
							"allow_zero_valuation_rate":1
		
				})
			
			
			opp.order_status="Stock Updated"
			stock_entry.save(ignore_permissions=True)
			stock_entry.submit()
			opp.save()
			frappe.msgprint("Stock Updated Successfully")

			
		# if stock.movement_type=="Stock OUT":
		# 	delivery_note=frappe.new_doc('Delivery Note')
		# 	delivery_note.customer=opp.party_name
		# 	delivery_note

		# 	stock_entry.stock_entry_type="Material Issue"
		# 	stock_entry.purpose="Material Issue"
		# 	for war in opp.warehouse_space_details:
		# 		stock_entry.append("items",{"s_warehouse":war.warehouse,
		# 					"item_code":stock.item,"qty":stock.quantity,
		# 					"allow_zero_valuation_rate":1
		
		# 		})
		
	
		
	return "success"




