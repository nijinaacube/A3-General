
import frappe
def on_submit(doc,methods):
					
	if doc.order_id:
		oppo = frappe.get_doc("Opportunity", doc.order_id)
		oppo.order_status = "Stock Updated"
		if doc.party_name:
			for itm in doc.items:
			
			
				warehouse_doc = frappe.get_doc("Warehouse", itm.t_warehouse)

				for items in warehouse_doc.warehouse_item:
					print(items)

					if items.booking_id == oppo.name :
						if doc.items:
							for itm in doc.items:
								if itm.qty:
									items.quantity = float(items.quantity) + itm.qty
									items.status = "Received"
									items.stock_entry_id=doc.name

				warehouse_doc.total_quantity = sum(item.quantity for item in warehouse_doc.warehouse_item)
				warehouse_doc.save()

		oppo.save()
	else:
		if doc.party_name:
				
				customer_warehouse = frappe.get_all("Warehouse", filters={"customer": doc.party_name}, pluck="name")
				print(customer_warehouse, "******")
				for itm in doc.items:
					for warehouse_name in customer_warehouse:
						print(warehouse_name, "oooooo")
						warehouses = frappe.get_doc("Warehouse", itm.t_warehouse)
						warehouses.append("warehouse_item",{"stock_entry_id":doc.name,"item":itm.item_code,"quantity":itm.qty,"status":"Received"})
						warehouses.total_quantity = sum(item.quantity for item in warehouses.warehouse_item)
						warehouses.save()

			



@frappe.whitelist()
def  get_items(doc):
	print(doc)
	oppo=frappe.get_doc("Opportunity",doc)
	if oppo.booking_type!="Warehousing":
		frappe.throw("You can't create stock entry other than Warehouse booking")
	else:
		if oppo.warehouse_stock_items:
			for itm in oppo.warehouse_stock_items:
				if itm.movement_type!="Stock IN":
					frappe.throw("You can create stock entry for STock IN only")
					



	data_from_receipt = []
	data = {}
	for type in oppo.warehouse_stock_items:
		data["type"]=type.movement_type
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
	return {"data": data_from_receipt}


@frappe.whitelist()
def  get_customer(name):
	stock=frappe.get_doc("Stock Entry",name)
	return stock.as_dict()