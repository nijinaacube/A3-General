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
                



  