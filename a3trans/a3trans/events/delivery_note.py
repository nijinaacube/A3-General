import frappe

def on_submit(doc,methods):
    doc.status="Closed"
    doc.update_status(doc.status)
    if doc.order_id:
        oppo=frappe.get_doc("Opportunity",doc.order_id)
        oppo.order_status="Closed"
        oppo.save()
@frappe.whitelist()
def  get_items(doc):
	print(doc)
	oppo=frappe.get_doc("Opportunity",doc)

	data_from_receipt = []
	data = {}
	if oppo.booking_type=="Warehouse":

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