frappe.ui.form.on('Stock Entry', {
	order_id: function(frm) {

if (frm.doc.order_id){
    frm.clear_table('items')
    frappe.call({
        method: "a3trans.a3trans.events.stock_entry.get_items",
        args:{
            "doc": frm.doc.order_id
        },
        callback: (r)=>{
            r.message.data.forEach((element)=>{
                const items = frm.add_child("items")
                    items.item_code = element.item
                    items.item_name = element.item
                    items.qty = element.quantity
                    items.description=element.description
                    items.uom=element.stock_uom
                    items.t_warehouse=element.war
                    items.allow_zero_valuation_rate=1
                    console.log(element.war)
                    frm.script_manager.trigger('item_code', items.doctype, items.name);
                    refresh_field("items")

                    cur_frm.set_value("party_name", element.party);
			        cur_frm.refresh_field("party_name");
                    cur_frm.set_value("customer", element.party);
			        cur_frm.refresh_field("customer");
                    if (element.type=="Stock IN"){
                        cur_frm.set_value("stock_entry_type","Material Receipt" );
                        cur_frm.refresh_field("stock_entry_type");

                    }
                   
            })

        }
    })
}
    }


})