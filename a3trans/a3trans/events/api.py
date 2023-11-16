import frappe

@frappe.whitelist(allow_guest=True)
def get_doctype_data(doctype,filters=None):
    docList = []
    getList = frappe.db.get_list(doctype, filters=filters)
    for item in getList:
        doc = frappe.get_doc(doctype, item["name"]).as_dict()
        docList.append(doc)

    return docList