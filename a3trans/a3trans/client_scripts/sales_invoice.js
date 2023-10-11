frappe.ui.form.on('Sales Invoice', {
   
      
    
    order_id: function(frm) {
       
        if (frm.doc.order_id) {
            frm.clear_table('items');
            console.log("hiii");
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.get_invoice_items",
                args: {
                    "doc": frm.doc.order_id
                },
                callback: (r) => {
                    console.log(r.message.data);
                    r.message.data.forEach((element) => {
                        
                        cur_frm.set_value("booking_type", element.b_type);
                        cur_frm.refresh_field("booking_type");

                        cur_frm.set_value("customer", element.party);
                        cur_frm.refresh_field("customer");
                        console.log("hiii", element);

                        const items = frm.add_child("items");
                        items.item_code = element.item;
                        items.item_name = element.item;
                        items.qty = element.quantity;
                        items.rate = element.rate;
                        frm.refresh_field("items");
                    });
                }
            });
        }
    },
    stock_entry_id: function(frm) {
        if (frm.doc.stock_entry_id) {
            console.log("yyyy")

            
            frm.fields_dict['items'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
                console.log("get_query called");
                return {
                    filters: {
                        "is_stock_item": 0
                    }
                };
            }
            // Fixed: Add "var" before stock_entry_id
            var stock_entry_id = frm.doc.stock_entry_id;
            frappe.call({
                method: "a3trans.a3trans.events.stock_entry.get_customer",
                args: {
                   
                    name: stock_entry_id
                },
                callback: function(data) {
                    console.log(data.message)
                    var stock = data.message;
                    cur_frm.set_value("customer", stock.party_name);
                    cur_frm.refresh_field("customer");
                    cur_frm.set_value("booking_type", "Warehouse");
                    cur_frm.refresh_field("booking_type");
                   

                }
            });
        }
    }
});
