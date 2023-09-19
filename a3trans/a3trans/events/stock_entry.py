
import frappe
def on_submit(doc,methods):

	# if doc.order_id=="":
	# 	if doc.party_name and doc.stock_entry_type=="Material Receipt":
	# 		oppo=frappe.new_doc("Opportunity")
	# 		oppo.party_name=doc.party_name
	# 		oppo.booking_type="Warehouse"
	# 		if doc.items:
	# 			for item in doc.items:
	# 				oppo.append("warehouse_space_details",{"warehouse":item.t_warehouse})

					
	if doc.order_id:
		oppo=frappe.get_doc("Opportunity",doc.order_id)
		oppo.order_status="Stock Updated"
		# oppo.save()


@frappe.whitelist()
def  get_items(doc):
	print(doc)
	oppo=frappe.get_doc("Opportunity",doc)

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