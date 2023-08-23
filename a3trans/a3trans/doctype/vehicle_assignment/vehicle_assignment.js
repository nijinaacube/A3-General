// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt

frappe.ui.form.on('Vehicle Assignment', {
	refresh:function(frm){
		var today = frappe.datetime.nowdate();
		var formattedDate = frappe.datetime.str_to_user(today);
		frm.set_value('assignment_date', formattedDate);
		
				frm.add_custom_button(__('Get Orders'), function() {
			
					var dialog = new frappe.ui.form.MultiSelectDialog({
						doctype: 'Opportunity', 
						target: frm,
						setters: {
							status: 'Converted'
						},
						columns: ['name', 'status'],  
						get_query() {
							return {
								filters: { docstatus: ['!=', 2] }  // Customize filters if needed
							};
						},
						action(selections) {
							// Handle selected opportunities
							if (selections && selections.length > 0) {
								selections.forEach(function(opportunity) {
									console.log(selections)
									var child = frm.add_child('routes', {});
									child.order_id = opportunity.name;
								});
								frm.refresh_field('routes');
								dialog.hide();
							}
						}
					})
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

	