frappe.ui.form.on('Payment Entry', {
	order_id: function(frm) {
       
        if (frm.doc.order_id){
            frm.clear_table('items')
          
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.get_payment_items",
                args:{
                    "doc": frm.doc.order_id
                },
                callback: (r)=>{
                    console.log("hiii",r.message)
                    r.message.data.forEach((element)=>{
                        cur_frm.set_value("booking_type", element.b_type);
                        cur_frm.refresh_field("booking_type");
                        cur_frm.set_value("party_name", element.party);
                        cur_frm.refresh_field("party_name");
                        cur_frm.set_value("party", element.party);
                        cur_frm.refresh_field("party");
                        cur_frm.set_value("party_type", "Customer");
                        cur_frm.refresh_field("party_type");
                        cur_frm.set_value("mode_of_payment", element.mode);
                        cur_frm.refresh_field("mode_of_payment");
                        cur_frm.set_value("paid_to", element.paid_to);
                        cur_frm.refresh_field("paid_to");
                        cur_frm.set_value("paid_amount", element.total_allocated_amount);
                        cur_frm.refresh_field("paid_amount");
                        cur_frm.set_value("paid_to_account_currency", element.paid_to_account_currency);
                        cur_frm.refresh_field("paid_to_account_currency");
                        cur_frm.set_value("paid_from_account_currency", element.paid_from_account_currency);
                        cur_frm.refresh_field("paid_from_account_currency");
                        cur_frm.set_value("payment_type", "Receive");
                        cur_frm.refresh_field("payment_type");
                        cur_frm.set_value("reference_date", element.reference_date);
                        cur_frm.refresh_field("reference_date");
                        cur_frm.set_value("total_allocated_amount", element.total_allocated_amount);
                        cur_frm.refresh_field("total_allocated_amount");

                        cur_frm.set_value("received_amount", element.total_allocated_amount);
                        cur_frm.refresh_field("received_amount");
                      
                            refresh_field("items")
                         
                    })

                }
            })
        }
    }
})