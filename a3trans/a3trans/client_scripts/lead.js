frappe.ui.form.on('Lead', {
    refresh: function(frm) {
        if (!cur_frm.doc.__islocal && frm.doc.status === "Lead") {
            frm.add_custom_button(__('Convert'), function() {
                
                
                frappe.call({
                    method: 'a3trans.a3trans.events.lead.convert',
                    args: {
                        'doc': frm.doc.name
                    },
                    callback: function(r) {
                        if (r.message) {
                            console.log(r.message.name);
                            console.log(frm.doc.booking_type)

                            // Pre-fill fields in the Opportunity from the Lead
                            frappe.new_doc('Opportunity', {
                                "opportunity_from": "Customer",
                                "lead_id":frm.doc.name,
                                "customer_name":r.message.name, // Set party_name from the returned data
                                "party_name":r.message.name,
                                "booking_type": frm.doc.booking_type,
                                "order_status": "New",
                                "booking_channel": frm.doc.booking_channel
                              
                            });
                        }
                    }
                });
            }).addClass('btn-primary');
        }
    },
    booking_type:function(frm){
        if(frm.doc.booking_type==="Warehouse"){
            frm.fields_dict['warehouse'].get_query = function(doc){
                    return {
                        filters: {
                            'is_group': 1
                        }
                    };
                

                }
    }

    },

mobile_number:function(frm) {
    if (frm.doc.mobile_number){

        cur_frm.set_value("phone",frm.doc.mobile_number)
        frm.refresh_field("phone")
        cur_frm.set_value("mobile_no",frm.doc.mobile_number)
        frm.refresh_field("mobile_no")
    }

}
});
