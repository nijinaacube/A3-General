frappe.ui.form.on('Delivery Note', {
	order_id: function(frm) {

if (frm.doc.order_id){
    
    frappe.call({
        method: "a3trans.a3trans.events.delivery_note.get_items",
        args:{
            "doc": frm.doc.order_id
        },
        callback: (r)=>{
            console.log(r.message)
            r.message.data.forEach((element)=>{

                frm.clear_table('items')
                const items = frm.add_child("items")
                    items.item_code = element.item
                    items.item_name = element.item
                    items.qty = element.quantity
                    // items.price_list_rate=element.price
                    // items.rate = element.price
                    items.description=element.description
                    items.uom=element.stock_uom
                    items.warehouse=element.war
                    
                    console.log(element.war)
                    refresh_field("items")
                    console.log(element.party)

                    cur_frm.set_value("customer", element.party);
			        cur_frm.refresh_field("customer");

                    cur_frm.set_value("job_number", element.job);
			        cur_frm.refresh_field("job_number");
            })
        }
    })
}


    },

    close_delivery_note: function(frm) {
        frm.set_value("status", "Closed");
        frm.refresh_field("status");
    
    
	},

})

