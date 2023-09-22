import frappe
def validate(doc,methods):
    print(doc.name)
    for items in doc.warehouse_item:
        if items.status=="Received":
            if items.checked==0:
                mat=frappe.new_doc("Stock Entry")
                mat.purpose="Material Receipt"
                mat.stock_entry_type="Material Receipt"
                mat.append("items",{"t_warehouse":doc.name,
                "item_code":items.item,"qty":items.quantity,"allow_zero_valuation_rate":1 })
                mat.save(ignore_permissions=True)
                mat.submit()   
                items.checked=1
                


@frappe.whitelist()
def get_warehouseaddress(doc):
    data={}
    ware=frappe.get_doc("Warehouse",doc)
    print(ware)
    if ware.phone_no:
        data["phone"]=ware.phone_no
    if ware.address_line_1:
        data["add1"]=ware.address_line_1
    if ware.address_line_2:
        data["add2"]=ware.address_line_2
    if ware.city:
        data["city"]=ware.city
    return data
    

    