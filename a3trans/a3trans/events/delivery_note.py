import frappe

def on_submit(doc,methods):
	doc.status="Closed"
	doc.update_status(doc.status)
	if doc.order_id:
		oppo=frappe.get_doc("Opportunity",doc.order_id)
		oppo.order_status="Closed"
		
	
		if doc.customer:
				
				customer_warehouse = frappe.get_list("Warehouse", filters={"customer": doc.customer})
				print(customer_warehouse, "******")
				for itm in doc.items:
				
					for warehouse in customer_warehouse:
						print(warehouse["name"], "oooooo")
						warehouse_doc = frappe.get_doc("Warehouse", itm.warehouse)
						for items in warehouse_doc.warehouse_item:
							if items.booking_id==oppo.name and items.item==itm.item_code:
								if float(items.quantity)>0 :
									qty=float(items.quantity)-itm.qty
									if qty < 0:
										frappe.throw("No sufficient item in Warehouse")
									print(qty,"@@@@")
									items.quantity=qty
								
									if qty == 0:
										items.status="Delivered"
							

						
						warehouse_doc.total_quantity = sum(item.quantity for item in warehouse_doc.warehouse_item)
						warehouse_doc.save()
		oppo.save()
	else:
		if doc.customer:
				
				customer_warehouse = frappe.get_list("Warehouse", filters={"customer": doc.customer})
				print(customer_warehouse, "******")
				for itm in doc.items:
				
					warehouse_doc = frappe.get_doc("Warehouse", itm.warehouse)
					for items in warehouse_doc.warehouse_item:
							if items.item==itm.item_code:
								if float(items.quantity)>0 :
									qty=float(items.quantity)-itm.qty
									if qty < 0:
										frappe.throw("No sufficient item in Warehouse")
									print(qty,"@@@@")
									items.quantity=qty

								
									if qty == 0:
										items.status="Delivered"
							

						
					warehouse_doc.total_quantity = sum(item.quantity for item in warehouse_doc.warehouse_item)
					warehouse_doc.save()
	
								
		
	
# 
@frappe.whitelist()
def  get_items(doc):
	print(doc)
	oppo=frappe.get_doc("Opportunity",doc)

	data_from_receipt = []
	data = {}
	if oppo.booking_type=="Warehouse":
		if oppo.job_number:
			data["job"] = oppo.job_number
		else:
			data["job"]=oppo.job_number
		for war in oppo.warehouse_space_details:
			data["war"]=war.warehouse
		for shipment in oppo.warehouse_stock_items:
			data["party"]=oppo.party_name
			data["item"] = shipment.item
			it=frappe.get_doc("Item",shipment.item)
			data["description"]=it.description
			data["stock_uom"]=it.stock_uom
			data["quantity"] = shipment.quantity
			data_from_receipt.append(data)
	if oppo.booking_type=="Vehicle":
		for itm in oppo.shipment_details:
			print(itm)
			data["party"]=oppo.party_name
			# data["item"]=itm.item
			# data_from_receipt.append(data)
			# it=frappe.get_doc("Item",itm.item)
			# data["description"]=it.description
			# data["stock_uom"]=it.stock_uom
			# data["quantity"] = itm.quantity


	return {"data": data_from_receipt}