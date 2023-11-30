import frappe


def on_submit(doc, method):
    if doc.items and doc.booking_id:
        oppo = frappe.get_doc("Opportunity", doc.booking_id)
        if oppo.transit_charges:
            for charge_item in oppo.transit_charges:
                for itm in doc.items:
                    if itm.idx == charge_item.idx:
                        itm.description = charge_item.description

                 
        if oppo.opportunity_line_item:
            for itm in doc.items:
                for line in oppo.opportunity_line_item:
                    if itm.item_code == line.item :
                        line.status = "Order"
                        if line.include_in_billing == 0:
                            line.include_in_billing=1
                        oppo.save()


                
        


@frappe.whitelist()
def get_order_items(doc):
    oppo = frappe.get_doc("Opportunity", doc)
    data_from_receipt = []

    if oppo.opportunity_line_item:
        pending_items_exist = False  # Flag to check if there are pending items

        for line in oppo.opportunity_line_item:
            if line.status == "Pending":
                pending_items_exist = True  # Set the flag to True
                data = {}
                data["b_type"] = oppo.booking_type
                if oppo.job_number:
                    data["job"] = oppo.job_number
                else:
                    data["job"] = ""
                data["party"] = oppo.party_name
                data["item"] = line.item
                it = frappe.get_doc("Item", line.item)
                if it:
                    if it.stock_uom:
                        data["uom"] = it.stock_uom
                    if it.description:
                        data["description"] = it.description
                    if oppo.company:
                        comp = frappe.get_doc("Company", oppo.company)
                        if comp and comp.default_income_account:
                            data["account"] = comp.default_income_account

                data["quantity"] = line.quantity
                data["rate"] = line.average_rate
                data_from_receipt.append(data)

        if not pending_items_exist:
            frappe.msgprint("No pending items found in the opportunity.")  # Display a message or take appropriate action
            return {"data": []}

    return {"data": data_from_receipt}

