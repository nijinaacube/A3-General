frappe.ui.form.on('Lead', {
    refresh: function(frm) {
        if (!cur_frm.doc.__islocal && frm.doc.status =="Lead"){ // Check if the Lead is not submitted
            frm.add_custom_button(__('Convert'), function() {
                frappe.call({
                    method: 'a3trans.a3trans.events.lead.convert',
                    args: {
                        'doc': frm.doc.name
                    },
                    callback: function(r) {
                        if (r.message) {
                            // Pre-fill fields in the Opportunity from the Lead
                            var opportunity_doc = frappe.model.get_new_doc('Opportunity');
                            opportunity_doc.party_name = frm.doc.name;
                            opportunity_doc.booking_type = frm.doc.booking_type;
                            opportunity_doc.order_status="New"
                            
                            // Set other fields as needed
                            // opportunity_doc.field_name = frm.doc.field_name;

                            // Open the Opportunity form with pre-filled data
                            frappe.set_route('Form', 'Opportunity', opportunity_doc.name);

                            // Alert the user to complete mandatory fields
                            // frappe.msgprint(__('Please complete mandatory fields in the Opportunity and save.'));
                        }
                    }
                });
            }).addClass('btn-primary');
        }
    }
});
