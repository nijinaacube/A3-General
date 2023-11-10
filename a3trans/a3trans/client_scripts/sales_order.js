frappe.ui.form.on('Sales Order', {
    booking_id: function(frm) {
        if (frm.doc.booking_id) {
            frm.clear_table('items');
            console.log("hiii");
            frappe.call({
                method: "a3trans.a3trans.events.sale_order.get_order_items",
                args: {
                    "doc": frm.doc.booking_id
                },
                callback: (r) => {
                    if (r.message && r.message.data) {
                        console.log(r.message.data, "WWWW");
                        frm.doc.items = [];
                        r.message.data.forEach((element) => {
                            frm.set_value("booking_type", element.b_type);
                            frm.set_value('delivery_date', frappe.datetime.nowdate());
                            frm.set_value("customer", element.party);
                            console.log("hiii", element);

                            const items = frm.add_child("items");
                            items.item_code = element.item;
                            items.uom = element.uom;
                            items.delivery_date =frappe.datetime.nowdate()
                            items.description = element.description;
                            items.income_account = element.account;
                            items.item_name = element.item;
                            items.qty = element.quantity;
                            items.rate = element.rate;

                            frm.refresh_field("items");
                        });
                    }
                }
            });
        }
    }
});