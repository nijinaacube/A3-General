frappe.ui.form.on('Sales Invoice', {
	order_id: function(frm) {
       
        if (frm.doc.order_id){
            frm.clear_table('items')
            console.log("hiii")
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.get_invoice_items",
                args:{
                    "doc": frm.doc.order_id
                },
                callback: (r)=>{
                    console.log("hiii",r.message)
                    r.message.data.forEach((element)=>{
                        cur_frm.set_value("booking_type", element.b_type);
                        cur_frm.refresh_field("booking_type");

                        cur_frm.set_value("customer", element.party);
                        cur_frm.refresh_field("customer");
                        console.log("hiii",element)
                        const items = frm.add_child("items")
                            items.item_code = element.item
                            items.item_name = element.item
                            items.qty = element.quantity
                            items.rate = element.rate
                            refresh_field("items")
                         
                    })

                }
            })
        }
    }
})