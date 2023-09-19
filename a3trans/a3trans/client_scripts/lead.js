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
    }
});
