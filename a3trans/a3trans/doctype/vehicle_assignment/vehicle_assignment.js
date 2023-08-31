// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt



frappe.ui.form.on('Vehicle Assignment', {
    refresh: function(frm) {
        var today = frappe.datetime.nowdate();
        var formattedDate = frappe.datetime.str_to_user(today);
        frm.set_value('assignment_date', formattedDate);

        frm.add_custom_button(__('Get Orders'), function() {
            // Clear existing routes before adding new ones
            frm.clear_table('routes');

            var dialog = new frappe.ui.form.MultiSelectDialog({
                doctype: 'Opportunity',
                target: frm,
                setters: {
                    status: 'Converted'
                },
                add_filters_group: 1,
                // allow_child_item_selection: 1,
                // child_fieldname: 'receiver_information',
                columns: ['status'],
                get_query() {
                    return {
                        filters: { status: ['=', 'open'] }
                    };
                },
                action(selections, args) {
                    if (selections && selections.length > 0) {
                    

                        selections.forEach(function(opportunity) {
                           
                            frappe.model.with_doc('Opportunity', opportunity, function() {
                                let oppo = frappe.model.get_doc('Opportunity', opportunity);
                                
                                    oppo.receiver_information.forEach(function(pickupRow) {
                                        var child = frm.add_child('routes', {});
                                        child.order_id = opportunity;
                                        child.location = pickupRow.location;
        
                                        child.type_of_location = pickupRow.type_of_location;
                                    });

                                    frm.refresh_field('routes');
                                
                            });
                        });

                        dialog.dialog.hide(); // Hide the dialog immediately after processing the selections
                    }
                }
            });
        });
    },





	onload: function(frm) {
		cur_frm.fields_dict['vehicle_id'].get_query = function(doc) {
			return {
				filters: {
					"vehicle_status": "Available",
					
				}
			 }
			}

		cur_frm.fields_dict['driver_id'].get_query = function(doc) {
			return {
				filters: {
					"status": "Available",
					"role"  :  "Driver"
				}
			 }
			},
			cur_frm.fields_dict['helper_id'].get_query = function(doc) {
				return {
					filters: {
						"status": "Available",
						"role"	:	"Helper"
					}
				 }
				}
		}
});






	