import frappe
# def validate(doc,methods):
#     print(doc.name)
#     for items in doc.warehouse_item:
#         if items.status=="Received":
#             if items.checked==0:
#                 mat=frappe.new_doc("Stock Entry")
#                 mat.purpose="Material Receipt"
#                 mat.stock_entry_type="Material Receipt"
#                 mat.append("items",{"t_warehouse":doc.name,
#                 "item_code":items.item,"qty":items.quantity,"allow_zero_valuation_rate":1 })
#                 mat.save(ignore_permissions=True)
#                 mat.submit()   
#                 items.checked=1
    
    

# def after_insert(doc,methods):
#     address=frappe.new_doc("Address")
#     address.address_type="Warehouse"
#     address.address_title="Office"
#     if doc.address_line_1:
#         address.address_line1 = doc.address_line_1
#     else:
#         address.address_line_1 ="NIL"
#     if doc.address_line_2:
#         address.address_line2 = doc.address_line_2
#     else:
#         address.address_line_2 = "NIL"
#     if doc.city:
#         address.city = doc.city
#     else:
#         address.city="NIL"
#     if doc.latitude:
#         address.latitude = doc.latitude
#     if doc.longitude:
#         address.longitude = doc.longitude
  
#     if doc.email_id:
#         address.email_id = doc.email_id
#     if doc.phone_no:
#         address.phone=doc.phone_no
#     address.append("links", {
# 							"link_doctype": "Warehouse",
# 							"link_name": doc.name
# 						})
#     address.save()

#     if not frappe.db.exists("Contact", {"first_name":doc.warehouse_name, "mobile_no":doc.phone_no}):
#         contact = frappe.new_doc("Contact")
#         print("hiii")
#         contact.first_name = doc.warehouse_name
#         if doc.email_id:
#             contact.append("email_ids", {
#             "email_id": doc.email_id,
#             "is_primary": 1,
#         })
#         contact.append("phone_nos", {
#             "phone": doc.phone_no,
#             "is_primary_phone": 1,
#             "is_primary_mobile_no": 1,
#         })
#         contact.append("links", {
#             "link_doctype": "Warehouse",
#             "link_name": doc.name,
#             "link_title": doc.name,
#         })
        
#         contact.insert()


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
    

    