
var ind = 1;
frappe.ui.form.on('Opportunity', {

		after_save: function(frm) {
			if (frm.doc.order_status == "New" && frm.doc.booking_type == "Transport") {
				var opportunityID = frm.doc.name;
				var orderStatus = frm.doc.order_status; // Retrieve the order status
				var Customer = frm.doc.party_name
	
				// Construct the URL with the opportunity ID and order status as query parameters
				var redirectURL = 'https://redlinestest.frappe.cloud/vehicle_assignment?opportunity_id=' + encodeURIComponent(opportunityID) + '&order_status=' + encodeURIComponent(orderStatus);
	
				// Redirect to the constructed URL
				window.location.href = redirectURL;
			}
		},

	
	
	
	// after_save: function(frm) {
	// 		// Create a new Project
	// 	if (frm.doc.order_status=="New" ){
	// 	if (frm.doc.booking_type=="Transport"){
	// 		frappe.new_doc("Vehicle Assignment", {
	// 			order: frm.doc.name, 
			
	// 		}).then(doc => {
	// 			frappe.set_route("Form", "Vehicle Assignment", doc.name);
	// 		});
	// 	}
	// 	}
	// 	},
	
		// order_id: function(frm) {
		// 	if (frm.doc.is_return == 1 && frm.doc.order_id) {
		// 		frappe.call({
		// 			method: "a3trans.a3trans.events.opportunity.get_return_order",
		// 			args: {
		// 				name: frm.doc.order_id,
		// 			},
		// 			callback: function(response) {
		// 				var oppo = response.message;
		// 				console.log(oppo, "!!!");
		
		// 				// Create a new row and add it at the beginning
		// 				var target_row = frappe.model.get_new_doc("receiver_information");
						
		// 				// Set the data in the new row
		// 				target_row.transit_type = oppo.last_transit_type;
		// 				target_row.zone = oppo.last_zone;
		// 				target_row.latitude = oppo.latitude;
		// 				target_row.longitude = oppo.longitude;
		// 				target_row.city = oppo.city;
		// 				target_row.address_line1 = oppo.line1;
		// 				target_row.address_line2 = oppo.line2;
		
		// 				frm.doc.receiver_information.unshift(target_row);  // Add at the beginning of the array
		
		// 				frm.refresh_field("receiver_information");
		// 			}
		// 		});
		// 	}
		// },
		
		
	has_return_trip: function (frm) {
		if (frm.doc.has_return_trip == 1) {
			if (!frm.doc.receiver_information) {
				frappe.throw("Please add Transit details First");
			}
			if (frm.doc.receiver_information.length < 2) {
				frappe.throw("Please add at least one pickup and drop-off in transit details");
			}
			
			
			
		}
	},
	
	

	refresh: function(frm) {
		if(!frm.is_new()){
		if (frm.doc.booking_type == "Transport" && frm.doc.status != "Lost"){
		frm.add_custom_button(__("Vehicle Map"), function() {
			var opportunityID = frm.doc.name;
				var orderStatus = frm.doc.order_status; // Retrieve the order status
				var Customer = frm.doc.party_name
				var vehicle_type = frm.doc.vehicle_type
				frappe.call({
					method:"a3trans.a3trans.events.opportunity.get_zones",
					args:{
						"order_id":frm.doc.name
					},
					callback: (r)=>{            	 
                    	console.log(r.message)
						var line1 = r.message.line1
						var city = r.message.city
						var phone = r.message.mobile
						var from = r.message.from
						var to = r.message.to
						var lat = r.message.lat
						var long = r.message.long
						// Construct the URL with the opportunity ID and order status as query parameters
					var redirectURL = 'http://local:8000/vehicle_assignment?opportunity_id=' + encodeURIComponent(opportunityID) + '&order_status=' + encodeURIComponent(orderStatus) + 
					'&customer='+ encodeURIComponent(Customer)+ '&type=' + encodeURIComponent(vehicle_type) + '&from=' + encodeURIComponent(from)  + '&to=' + encodeURIComponent(to)
					+ '&lat=' + encodeURIComponent(lat) + '&long=' + encodeURIComponent(long) + '&line1=' + encodeURIComponent(line1) + '&city=' + encodeURIComponent(city)
					+ '&phone=' + encodeURIComponent(phone)
					// Redirect to the constructed URL
					window.location.href = redirectURL;
					}
				})
			
	
			
		}).addClass('btn-primary');
	}
	}
		
		
    	// if (frm.doc.booking_type!="Warehouse"){
    	// frm.fields_dict['links'].toggle(false);
    	// }
 
    	if  (frm.is_new()){
			
				ind = 1
        	frm.set_value('booking_date', frappe.datetime.get_today());
      	}
     	 
    	if(!frm.is_new() && frm.doc.order_status != "Stock Updated") {
        	if (frm.doc.booking_type=="Warehouse"){
        	// Add a custom button to the form
      	 
        	frm.add_custom_button(__("Create Stock Entry"), function() {
            	frappe.call({
                	method: "a3trans.a3trans.events.opportunity.create_stock_entry",
                	args:{
                    	"doc": frm.doc.name,	 
                   	 
                	},
    
                	callback: (r)=>{
               	 
                    	console.log(r.message)
                    	frappe.show_alert({message: __('Stock Entry Created Successfully'), indicator: 'green'});
                 	 
                	}
    
           	 
            	})
       	 
        	})
    	}
		if (frm.doc.status != "Closed" && frm.doc.order_status != "Delivered" && frm.doc.order_status != "Closed" && frm.doc.status != "Lost") { // Check if the document is saved
			frm.add_custom_button(__('Cancel Booking'), function() {
			frappe.confirm(
			__('Are you sure you want to Cancel Booking?'),
			function() {
			// User clicked "Yes" in the confirmation dialog
			frappe.call({
				method: "a3trans.a3trans.events.opportunity.cancel_booking",
				args: {
				"name": frm.doc.name,
				},
				callback: function(r) {
				console.log(r.message)
				console.log("rr")
				if (r.message) {
				let d = new frappe.ui.Dialog({
				title: 'Cancellation Charges Details',
				fields: [
				{
				label: 'Cancellation Charge',
				fieldname: 'cancellation_charge',
				fieldtype: 'Currency'
				},
				
				{
				label: 'Allow with Zero Cost',
				fieldname: 'zero_cost',
				fieldtype: 'Check'
				}
				],
				size: 'small', // small, large, extra-large
				primary_action_label: 'Submit',
			primary_action(values) {
				if (values.zero_cost =="0"){
				frappe.call({
					method: "a3trans.a3trans.events.opportunity.cancellation_charges",
					args: {
					"name": frm.doc.name,
					"cost" :values.cancellation_charge,
					"zero_cost":values.zero_cost
					},
					callback: function(r) {
						console.log(r.message,"cancellation charges")
						frappe.show_alert("Invoice for Cancellation Charges Created.")

					}
				})
			}
				frm.set_value("status","Lost")
				
				// frm.refresh_field("status")
				

			console.log(values);
			d.hide();
				}
				});
			d.show();
			}
			if (!r.message) {
			
				frm.set_value("status","Lost")
				
				frm.refresh_field("status")
			
				
			
			}
			}
			});
			},
			function() {
			// User clicked "No" in the confirmation dialog
			// Add any behavior you want when the user clicks "No"
			}
			);
			});
			}
			
		
		
		if (frm.doc.order_status !== "Delivered" || frm.doc.order_status !== "Closed"){
		frm.add_custom_button(__("Execute"), function() {
			
			// Check if the invoice_id is set
			if (frm.doc.invoice_id) {
				// Specify the document type and name to open
				frappe.route_options = {
					'name': frm.doc.invoice_id,
					'doctype': 'Sales Invoice'
				};
		
				// Open the Sales Invoice
				frappe.set_route("Form", "Sales Invoice", frm.doc.invoice_id);
			} else {
				frappe.msgprint(__('No invoice linked against this order. Please create invoice via connections'));
			}
		
		}).addClass('btn-primary');
	}
	}

	 
	frm.fields_dict['receiver_information'].grid.get_field('additional_service_1').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
		 
	frm.fields_dict['receiver_information'].grid.get_field('additional_service_2').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
		 
	frm.fields_dict['receiver_information'].grid.get_field('additional_service_3').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
		 
	frm.fields_dict['receiver_information'].grid.get_field('additional_services_4').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
		 
	frm.fields_dict['receiver_information'].grid.get_field('service_5').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
	 
	frm.fields_dict['receiver_information'].grid.get_field('service6').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
		 
	frm.fields_dict['receiver_information'].grid.get_field('service7').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};

	frm.fields_dict['receiver_information'].grid.get_field('service8').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
	frm.fields_dict['receiver_information'].grid.get_field('service9').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
	frm.fields_dict['receiver_information'].grid.get_field('service10').get_query = function(doc, cdt, cdn) {
          	 
		return {
			filters: {
				"item_group": ["in", "Additional Services"]
			}
		};
	};
}

    
});


frappe.ui.form.on('Opportunity', {

    
	party_name: function(frm) {
   	 
    	if (frm.doc.party_name){
        	if (frm.doc.booking_type=="Warehousing"){
      	 
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_warehouse",
            	args: {
                	"doc": frm.doc.party_name,
            	},
            	callback: function(r) {
                	if (r.message) {
                    	console.log("Callback received:", r.message);
                   	 

                    	if (r.message && r.message.length > 0) {
                       	 
                            	frm.clear_table("warehouse_space_details")
                        	const target_row = frm.add_child('warehouse_space_details');
                        	target_row.warehouse = r.message[0];
                        	frm.refresh_field('warehouse_space_details');
                       	 
                        	// Trigger the warehouse field to execute its associated logic
                        	frm.script_manager.trigger('warehouse', target_row.doctype, target_row.name);
                    	}
               	 
                    	frm.fields_dict['warehouse_space_details'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                        	if (r.message.length > 0) {
                        	return {
                            	filters: {
                                	"name": ["in", r.message]
                            	}
                        	};  
                         	}

                        	else{

                            	return {
                                	filters: {
                                    	"name": ["in", ""]
                                	}
                            	};
                        	}
                  	 
                	}
                	frm.fields_dict['warehouse_space_details'].grid.refresh();
              	 
                    	frm.fields_dict['receiver_information'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                        	if (r.message.length > 0) {
                        	return {
                            	filters: {
                                	"name": ["in", r.message]
                            	}
                        	};
                       	 
                    	}
                   	 
              	else{

                	return {
                    	filters: {
                        	"name": ["in", ""]
                    	}
                	};
              	}
                  	 
                	}
                	frm.fields_dict['receiver_information'].grid.refresh();
            	}
         	 
        	}
        	});
    	}
   	 
    	if (frm.doc.booking_type=="Transport"){
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_default_address",
            	args: {
                	"doc": frm.doc.party_name,
            	},
            	callback: function(r) {
                	
                	if (r.message) {

                	const target_row=frm.add_child('receiver_information')
   				 	target_row.address=r.message["name"]
                	target_row.city=r.message["city"]
                	target_row.address_line1=r.message["address1"]
                	target_row.address_line2=r.message["address2"]
                	target_row.latitude=r.message["lat"]
                	target_row.longitude=r.message["lon"]
                	target_row.contact=r.message["phone"]
                	target_row.name1=r.message["title"]
                	target_row.is_default=1
                	target_row.order_no=1
   				 	frm.refresh_field('receiver_information');
              
                  	 
                	 
                	}
             	 
            	}
        	})

    	}


        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_addresses",
            	args: {
                	"doc": frm.doc.party_name,
            	},
            	callback: function(r) {
                	if (r.message) {
                    	frm.fields_dict['receiver_information'].grid.get_field('address').get_query = function(doc, cdt, cdn) {
                        	return {
                            	filters: {
                                	"name": ["in", r.message],
                                	"address_type":"Shipping"
                            	}
                        	};
                    	};
                	}
            	}
        	});
       	 

    	}
 
	}
})

frappe.ui.form.on('Opportunity', {

    
	booking_type: function(frm) {
    	if (frm.doc.party_name ){
      	 
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_warehouse",
            	args: {
                	"doc": frm.doc.party_name,
            	},
            	callback: function(r) {
                	if (r.message) {
                    	console.log("Callback received:", r.message);
                   	 

                    	if (r.message && r.message.length > 0) {
                        	if (frm.doc.booking_type=="Warehousing"){
                            	frm.clear_table("warehouse_space_details")
                        	const target_row = frm.add_child('warehouse_space_details');
                        	target_row.warehouse = r.message[0];
                        	frm.refresh_field('warehouse_space_details');
                       	 
                        	// Trigger the warehouse field to execute its associated logic
                        	frm.script_manager.trigger('warehouse', target_row.doctype, target_row.name);
                    	}
                	}
                    	frm.fields_dict['warehouse_space_details'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                        	if (r.message.length > 0) {
                        	return {
                            	filters: {
                                	"name": ["in", r.message]
                            	}
                        	};  
                         	}

                        	else{

                            	return {
                                	filters: {
                                    	"name": ["in", ""]
                                	}
                            	};
                        	}
                  	 
                	}
                	frm.fields_dict['warehouse_space_details'].grid.refresh();
               	 
              	 
                    	frm.fields_dict['receiver_information'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                        	if (r.message.length > 0) {
                        	return {
                            	filters: {
                                	"name": ["in", r.message]
                            	}
                        	};
                       	 
                    	}
                   	 
              	else{

                	return {
                    	filters: {
                        	"name": ["in", ""]
                    	}
                	};
              	}
                  	 
                	}
                	frm.fields_dict['receiver_information'].grid.refresh();
            	}
         	 
        	}
        	});
   	 
    	if (frm.doc.booking_type=="Transport"){
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_default_address",
            	args: {
                	"doc": frm.doc.party_name,
            	},
            	callback: function(r) {
                	// frm.clear_table("receiver_information")
                	if (r.message) {

                	const target_row=frm.add_child('receiver_information')
   				 	target_row.address=r.message["name"]
                	target_row.city=r.message["city"]
                	target_row.address_line1=r.message["address1"]
                	target_row.address_line2=r.message["address2"]
                	target_row.latitude=r.message["lat"]
                	target_row.longitude=r.message["lon"]
                	target_row.contact=r.message["phone"]
                	target_row.name1=r.message["title"]
                	target_row.is_default=1
                	target_row.order_no=1
   				 	frm.refresh_field('receiver_information');
                  	 
                	 
                	}
             	 
            	}
        	})

    	}
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_addresses",
            	args: {
                	"doc": frm.doc.party_name,
            	},
            	callback: function(r) {
                	if (r.message) {
                    	frm.fields_dict['receiver_information'].grid.get_field('address').get_query = function(doc, cdt, cdn) {
                        	return {
                            	filters: {
                                	"name": ["in", r.message],
                                	"address_type":"Shipping"
                            	}
                        	};
                    	};
                	}
            	}
        	});
       	 
			frm.fields_dict['receiver_information'].grid.get_field('additional_service_1').get_query = function(doc, cdt, cdn) {
          	 
            	return {
                	filters: {
                    	"item_group": ["in", "Additional Services"]
                	}
            	};
        	};

    	}

	
    	frm.fields_dict['opportunity_line_item'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
          	 
        	return {
            	filters: {
                	"is_stock_item": 0
            	}
        	};
    	};
    

    	if (frm.doc.booking_type == "Warehousing") {
        	frm.fields_dict['warehouse_stock_items'].grid.get_field('choose_labour_service').get_query = function(doc, cdt, cdn) {
          	 
            	return {
                	filters: {
                    	"item_group": ["in", "Labour Charges"]
                	}
            	};
        	};
			frm.fields_dict['warehouse_stock_items'].grid.get_field('choose_loading_service').get_query = function(doc, cdt, cdn) {
          	 
            	return {
                	filters: {
                    	"item_group": ["in", "Loading Charges"]
                	}
            	};
        	};
   	 

        	frm.fields_dict['warehouse_stock_items'].grid.get_field('choose_handling_service').get_query = function(doc, cdt, cdn) {
          	 
            	return {
                	filters: {
                    	"item_group": ["in", "Handling Charges"]
                	}
            	};
        	};
    	}


	},
    
})





frappe.ui.form.on('Opportunity', {
	vehicle_type: function(frm, cdt, cdn) {
		
    	const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
		frm.set_value("table_length",zones.length)
	
		
		if (!frm.doc.transit_charges) {
			frm.doc.transit_charges = [];
		}
	
			const row = locals[cdt][cdn];
			if (!row.index){
			row.index = ind;
			ind += 1;
			}
			frm.refresh_field("receiver_information");
			const transit_details = frm.doc.receiver_information;
			if (frm.doc.vehicle_type) {
			if (transit_details.length > 1) {
			const from_row = transit_details[transit_details.length - 2];
			const to_row = transit_details[transit_details.length - 1];
			// Calculate transportation cost between the current and previous zones
			frappe.call({
					method: 'a3trans.a3trans.events.opportunity.calculate_transportation_cost',
					args: {
					'zone': JSON.stringify([from_row.zone, to_row.zone]),
					'vehicle_type': frm.doc.vehicle_type,
					'customer':frm.doc.party_name,
					"booking_type":frm.doc.booking_type
					},
			callback: function(response) {
			console.log(response.message);
			const cost = response.message.amount;
			// Update or create 'transit_charges_item' child table rows
			const transit_charges = frm.doc.transit_charges || [];
			let updated = false;
			for (let i = 0; i < transit_charges.length; i++) {
			const charge = transit_charges[i];
			if (charge.from_id === row.index) {
			console.log("success",cost);
			var fromcity = charge.description.split(" to ")
			console.log(fromcity,"&&&&&&&&&")
			frappe.call({
					method: 'a3trans.a3trans.events.lead.calculate_transportation_cost',
					args: {
					'zone': JSON.stringify([fromcity[0], fromcity[1]]),
					'vehicle_type': frm.doc.vehicle_type,
					'customer':frm.doc.party_name,
					"booking_type":frm.doc.booking_type
					},
			callback: function(response) {
			console.log(response.message,fromcity[0],fromcity[1],"@@@@@@@@@@@@@!!!!!!!!!!!1")
			// Update the existing transportation charge row
			charge.cost = response.message.amount;
			console.log(charge.cost)
			frm.script_manager.trigger('cost', charge.doctype, charge.name);
			frm.refresh_field('transit_charges');
			}
			})
			// Update the existing transportation charge row
			// charge.cost = 0;
			var fromcity = charge.description.split(" to ")
			charge.description = row.zone + ' to ' + fromcity[1]; // Updated description
			frm.refresh_field('transit_charges');
			updated = true;
			}
			if (charge.to_id === row.index) {
			// console.log(charge.description.split("to"),"$$$$$$$$$$$$$4")
			var fromcity = charge.description.split(" to ")
			console.log(fromcity,"^^^^^^^^^^^^^^^^^^^^",row.zone)
			console.log("success",cost);
			frappe.call({
				method: 'a3trans.a3trans.events.lead.calculate_transportation_cost',
				args: {
				'zone': JSON.stringify([fromcity[1], fromcity[0]]),
				'vehicle_type': frm.doc.vehicle_type,
				'customer':frm.doc.party_name,
				"booking_type":frm.doc.booking_type
				},
				callback: function(response) {
			// console.log(response.message,fromcity[1],row.zone,"@@@@@@@@@@@@@")
			// // Update the existing transportation charge row
			charge.cost = response.message.amount;
			frm.script_manager.trigger('cost', charge.doctype, charge.name);
			frm.refresh_field('transit_charges');
			}
			})
			charge.description = fromcity[0] + ' to ' + row.zone 
			frm.script_manager.trigger('cost', charge.doctype, charge.name);
			frm.refresh_field('transit_charges');
			updated = true;
			}
			}
			if (!updated) {
			// Create a new 'transit_charges_item' child table row
			const transit_charges_row = frm.add_child('transit_charges');
			transit_charges_row.charges = response.message.bill_item;
			transit_charges_row.quantity = 1;
			transit_charges_row.description = from_row.zone + ' to ' + row.zone; // Updated description
			transit_charges_row.cost = cost;
			transit_charges_row.from_id = from_row.index;
			transit_charges_row.to_id = row.index;
			frm.script_manager.trigger('cost', transit_charges_row.doctype, transit_charges_row.name);
			frm.refresh_field('transit_charges');
			}
			}
			});
			}
			}
			else{
			frappe.throw("Please choose vehicle Type")
			}
			},


mobile_number: function(frm){
   	 
	if (frm.doc.mobile_number){
	frappe.call({
	method:"a3trans.a3trans.events.opportunity.get_sender_data",
	args: {

    	mobile_number: frm.doc.mobile_number,
	},
	callback: (r) => {
    	console.log(r.message)
    	cur_frm.set_value("party_name", r.message["customer_name"]);
    	frm.refresh_field('party_name');
    
	}
})
}
},

})

frappe.ui.form.on('Return Trips', {
	zone: function(frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		const zones = frm.doc.return_trips.map(trip => trip.zone);
	
		
		if (frm.doc.has_return_trip == 1) {
			if (!frm.doc.receiver_information) {
				frappe.throw("Please add Transit details First");
			} else {
				var rows = frm.doc.receiver_information;
				var zoneCount = 0;
	
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].zone) {
						zoneCount++;
					}
				}
	
				if (zoneCount !== 2) {
					frappe.throw("Please add exactly two zones (pickup and drop off) in transit details to enable return trips");
				}
			}
			if (!child.return_id) {
				const target_row = frm.add_child('transit_charges');
				target_row.charges = "Return Charges";
				child.return_id = target_row.idx;
				target_row.quantity = 1;
				target_row.cost = 0;
				if (zones.length >= 2 && zones[zones.length - 1] != "") {
					target_row.description = zones[zones.length - 2] + " to " + zones[zones.length - 1];
				} else {
					target_row.description = "To " + zones[zones.length - 1];
				}
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.return_id);
				if (existing_row) {
					if (zones.length >= 2) {
						if (child.idx == 1) {
							existing_row.description = "To " + zones[0];
						} else if (child.idx >= 2) {
							existing_row.description = zones[zones.length - 2] + " to " + zones[zones.length - 1];
						}
					}
					frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
					frm.refresh_field('transit_charges');
				}
			}
		}
	}
});


frappe.ui.form.on('Transit Details', {

	additional_service_1_rate:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.additional_service_1
		const quantity = child.additional_service_1_quantity
		if (child.additional_service_1_rate){
			var total = (child.additional_service_1_rate) * (child.additional_service_1_quantity)
			child.amount = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id1);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	additional_service_2_rate:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.additional_service_2
		const quantity = child.additional_service_2_quantity
		if (child.additional_service_2_rate){
			var total = (child.additional_service_2_rate) * (child.additional_service_2_quantity)
			child.amount_2 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id2);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	additional_service_3_rate:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.additional_service_3
		const quantity = child.additional_service_3_quantity
		if (child.additional_service_3_rate){
			var total = (child.additional_service_3_rate) * (child.additional_service_3_quantity)
			child.amount3 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id3);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},

	rate4:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.additional_services_4
		const quantity = child.additional_service_4_quantity
		if (child.rate4){
			var total = (child.rate4) * (child.additional_service_4_quantity)
			child.amount4 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id4);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	rate5:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service_5
		const quantity = child.quantity_5
		if (child.rate5){
			var total = (child.rate5) * (child.quantity_5)
			child.amount5 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id5);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	rate6:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service6
		const quantity = child.quantity_6
		if (child.rate6){
			var total = (child.rate6) * (child.quantity_6)
			child.amount6 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id6);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	rate7:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service7
		const quantity = child.quantity7
		if (child.rate7){
			var total = (child.rate7) * (child.quantity7)
			child.amount7 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id7);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	rate8:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service8
		const quantity = child.quantity8
		if (child.rate8){
			var total = (child.rate8) * (child.quantity8)
			child.amount8 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id8);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	rate9:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service9
		const quantity = child.quantity9
		if (child.rate9){
			var total = (child.rate9) * (child.quantity9)
			child.amount9 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id9);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	rate10:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service10
		const quantity = child.quantity10
		if (child.rate10){
			var total = (child.rate10) * (child.quantity10)
			child.amount10 = total
			frm.refresh_field("receiver_information")
			const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id10);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
		}

	},
	add_more: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add_more == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id2) {
					
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id2);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id2);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.additional_service_2 = "";
			child.additional_service_2_quantity = "";
			child.additional_service_2_rate = "";
			child.amount_2 = "";
			child.id2 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add_more_2: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add_more_2 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id3) {
					
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id3);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id3);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.additional_service_3 = "";
			child.additional_service_3_quantity = "";
			child.additional_service_3_rate = "";
			child.amount3 = "";
			child.id3 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add_more_3: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add_more_3 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id4) {
				
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id4);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id4);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.additional_services_4 = "";
			child.additional_service_4_quantity = "";
			child.rate4 = "";
			child.amount4 = "";
			child.id4 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add3: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add3 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id5) {
					
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id5);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id5);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service_5= "";
			child.quantity_5 = "";
			child.rate5 = "";
			child.amount5 = "";
			child.id5 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add5: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add5 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id6) {
				
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id6);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id6);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service6= "";
			child.quantity_6 = "";
			child.rate6 = "";
			child.amount6 = "";
			child.id6 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add6: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add6 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id7) {
				
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id7);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id7);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service7= "";
			child.quantity7 = "";
			child.rate7 = "";
			child.amount7 = "";
			child.id7 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add7: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add7 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id8) {
					
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id8);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id8);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service8= "";
			child.quantity8 = "";
			child.rate8 = "";
			child.amount8 = "";
			child.id8 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add8: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add8 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id9) {
					
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id9);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id9);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service9= "";
			child.quantity9 = "";
			child.rate9 = "";
			child.amount9 = "";
			child.id9 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
	add9: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add9 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id10) {
				
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id10);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id10);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.transit_charges.splice(rowIdx, 1);
						frm.refresh_field('transit_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service10= "";
			child.quantity10 = "";
			child.rate10 = "";
			child.amount10 = "";
			child.id10 = ""
			frm.refresh_field("receiver_information");

		
		}
	},
    additional_service_1: function (frm, cdt, cdn) {
		
        updateTransitCharges(frm, cdt, cdn);
			
		

    },

    additional_service_1_quantity: function (frm, cdt, cdn) {
        updateTransitCharges(frm, cdt, cdn);
    },

    amount: function (frm, cdt, cdn) {
        updateTransitCharges(frm, cdt, cdn);
    },

	additional_service_2:function (frm, cdt, cdn) {
        updateTransitCharges2(frm, cdt, cdn);

    },
    
	additional_service_2_quantity:function (frm, cdt, cdn) {
        updateTransitCharges2(frm, cdt, cdn);

    },
	amount_2 :function (frm, cdt, cdn) {
        updateTransitCharges2(frm, cdt, cdn);

    },

	additional_service_3:function (frm, cdt, cdn) {
        updateTransitCharges3(frm, cdt, cdn);

    },

	additional_service_3_quantity:function (frm, cdt, cdn) {
        updateTransitCharges3(frm, cdt, cdn);

    },
	amount3:function (frm, cdt, cdn) {
        updateTransitCharges3(frm, cdt, cdn);

    },
	additional_services_4:function (frm, cdt, cdn) {
        updateTransitCharges4(frm, cdt, cdn);

    },

	additional_service_4_quantity:function (frm, cdt, cdn) {
        updateTransitCharges4(frm, cdt, cdn);

    },

	amount4:function (frm, cdt, cdn) {
        updateTransitCharges4(frm, cdt, cdn);

    },
	service_5:function (frm, cdt, cdn) {
        updateTransitCharges5(frm, cdt, cdn);

    },
	quantity_5:function (frm, cdt, cdn) {
        updateTransitCharges5(frm, cdt, cdn);

    },
	amount5:function (frm, cdt, cdn) {
        updateTransitCharges5(frm, cdt, cdn);

    },

	service6:function (frm, cdt, cdn) {
        updateTransitCharges6(frm, cdt, cdn);

    },
	quantity_6:function (frm, cdt, cdn) {
        updateTransitCharges6(frm, cdt, cdn);

    },
	amount6:function (frm, cdt, cdn) {
        updateTransitCharges6(frm, cdt, cdn);

    },
	service7:function (frm, cdt, cdn) {
        updateTransitCharges7(frm, cdt, cdn);

    },
	
	quantity7:function (frm, cdt, cdn) {
        updateTransitCharges7(frm, cdt, cdn);

    },
	amount7:function (frm, cdt, cdn) {
        updateTransitCharges7(frm, cdt, cdn);

    },

	service8:function (frm, cdt, cdn) {
        updateTransitCharges8(frm, cdt, cdn);

    },
	
	quantity8:function (frm, cdt, cdn) {
        updateTransitCharges8(frm, cdt, cdn);

    },
	amount8:function (frm, cdt, cdn) {
        updateTransitCharges8(frm, cdt, cdn);

    },

	service9:function (frm, cdt, cdn) {
        updateTransitCharges9(frm, cdt, cdn);

    },
	
	quantity9:function (frm, cdt, cdn) {
        updateTransitCharges9(frm, cdt, cdn);

    },
	amount9:function (frm, cdt, cdn) {
        updateTransitCharges9(frm, cdt, cdn);

    },
	service10:function (frm, cdt, cdn) {
        updateTransitCharges10(frm, cdt, cdn);

    },
	
	quantity10:function (frm, cdt, cdn) {
        updateTransitCharges10(frm, cdt, cdn);

    },
	amount10:function (frm, cdt, cdn) {
        updateTransitCharges10(frm, cdt, cdn);

    },
warehouse: function(frm, cdt, cdn) {
            	var child = locals[cdt][cdn];   	 
                	 
            	var war=child.warehouse   	 
            	console.log(child.warehouse)   
            	if (child.warehouse)	{

                	 
            	frappe.call({
                            	method: "a3trans.a3trans.events.opportunity.fetch_warehouse",       	 
                            	args: {          	 
                                               	 
                                	warehouse:war       	 
                            	},       	 
                            	callback: function(r) {
                                	console.log(r.message)
                               	 
                                    	frappe.model.set_value(cdt, cdn, 'city',r.message["city"]);               	 
                                    	frm.refresh_field('city');    
                                    	frappe.model.set_value(cdt, cdn, 'address_line1',r.message["address1"]);               	 
                                    	frm.refresh_field('address_line1');    
                                    	frappe.model.set_value(cdt, cdn, 'address_line2',r.message["address2"]);               	 
                                    	frm.refresh_field('address_line1');
                                    	frappe.model.set_value(cdt, cdn, 'latitude',r.message["lat"]);               	 
                                    	frm.refresh_field('latitude');            	 
                                    	frappe.model.set_value(cdt, cdn, 'longitude',r.message["lon"]);               	 
                                    	frm.refresh_field('longitude');
                                    	frappe.model.set_value(cdt, cdn, 'contact',r.message["phone"]);               	 
                                    	frm.refresh_field('contact');
                                    	frappe.model.set_value(cdt, cdn, 'address',"");               	 
                                    	frm.refresh_field('address');
												
				
							}
							})
						}

				
			},


zone: function(frm, cdt, cdn) {
	
	const row = locals[cdt][cdn];

	
	if (!frm.doc.transit_charges) {
    	frm.doc.transit_charges = [];
	}
	if (row.id1){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id1);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id2){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id2);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id3){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id3);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id4){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id4);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id5){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id5);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id6){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id6);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id7){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id7);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id8){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id8);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id9){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id9);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
	if (row.id10){
			
		const existing_row = frm.doc.transit_charges.find(rows => rows.idx === row.id10);
		existing_row.description =  "Services for " + row.transit_type + " Location " + row.zone;
		frm.refresh_field('transit_charges');
	}
		const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
		frm.set_value("table_length",zones.length)
		
		
		if (!row.index){
		row.index = ind;
		ind += 1;
		}
		frm.refresh_field("receiver_information");
		const transit_details = frm.doc.receiver_information;
		if (frm.doc.vehicle_type) {
		if (transit_details.length > 1) {
		const from_row = transit_details[transit_details.length - 2];
		const to_row = transit_details[transit_details.length - 1];
		// Calculate transportation cost between the current and previous zones
		frappe.call({
			method: 'a3trans.a3trans.events.opportunity.calculate_transportation_cost',
			args: {
			'zone': JSON.stringify([from_row.zone, to_row.zone]),
			'vehicle_type': frm.doc.vehicle_type,
			'customer':frm.doc.party_name,
			'booking_type':frm.doc.booking_type
			},
			callback: function(response) {
			console.log(response.message);
			const cost = response.message.amount;
			// Update or create 'transit_charges_item' child table rows
			const transit_charges = frm.doc.transit_charges || [];
			let updated = false;
			for (let i = 0; i < transit_charges.length; i++) {
			const charge = transit_charges[i];
			if (charge.from_id === row.index) {
			console.log("success",cost);
			var fromcity = charge.description.split(" to ")
			console.log(fromcity,"&&&&&&&&&")

		frappe.call({
			method: 'a3trans.a3trans.events.lead.calculate_transportation_cost',
			args: {
			'zone': JSON.stringify([fromcity[0], fromcity[1]]),
			'vehicle_type': frm.doc.vehicle_type,
			'customer':frm.doc.party_name,
			'booking_type':frm.doc.booking_type
			},
			callback: function(response) {
			console.log(response.message,fromcity[0],fromcity[1],"@@@@@@@@@@@@@!!!!!!!!!!!1")
			// Update the existing transportation charge row
			charge.cost = response.message.amount;
			console.log(charge.cost)
			frm.script_manager.trigger('cost', charge.doctype, charge.name);
			frm.refresh_field('transit_charges');
			}
		})
			// Update the existing transportation charge row
			// charge.cost = 0;
			var fromcity = charge.description.split(" to ")
			charge.description = row.zone + ' to ' + fromcity[1]; // Updated description
			frm.refresh_field('transit_charges');
			updated = true;
			}
			if (charge.to_id === row.index) {
			// console.log(charge.description.split("to"),"$$$$$$$$$$$$$4")
			var fromcity = charge.description.split(" to ")
			console.log(fromcity,"^^^^^^^^^^^^^^^^^^^^")
			console.log("success",cost);
		frappe.call({
			method: 'a3trans.a3trans.events.lead.calculate_transportation_cost',
			args: {
			'zone': JSON.stringify([fromcity[1], fromcity[0]]),
			'vehicle_type': frm.doc.vehicle_type,
			'customer':frm.doc.party_name,
			'booking_type':frm.doc.booking_type
			},
			callback: function(response) {
			// console.log(response.message,fromcity[1],row.zone,"@@@@@@@@@@@@@")
			// // Update the existing transportation charge row
			charge.cost = response.message.amount;
			frm.script_manager.trigger('cost', charge.doctype, charge.name);
			frm.refresh_field('transit_charges');
			}
		})
		charge.description = fromcity[0] + ' to ' + row.zone 
		frm.script_manager.trigger('cost', charge.doctype, charge.name);
		frm.refresh_field('transit_charges');
		updated = true;
		}
		}
		if (!updated) {
		// Create a new 'transit_charges_item' child table row
		const transit_charges_row = frm.add_child('transit_charges');
		transit_charges_row.charges = response.message.bill_item;
		transit_charges_row.quantity = 1;
		transit_charges_row.description = from_row.zone + ' to ' + row.zone; // Updated description
		transit_charges_row.cost = cost;
		transit_charges_row.from_id = from_row.index;
		transit_charges_row.to_id = row.index;
		frm.script_manager.trigger('cost', transit_charges_row.doctype, transit_charges_row.name);
		frm.refresh_field('transit_charges');
		}
		}
		});
		}
		}
		else{
		frappe.throw("Please choose vehicle Type")
		}
		},

address:function(frm, cdt, cdn) {
			var child = locals[cdt][cdn];       	 
			var add=child.address   	 
			console.log(child.address)    	 
				if (add){
			frappe.call({
							method: "a3trans.a3trans.events.opportunity.fetch_address",       	 
							args: {          	 
											
								address:add       	 
							},       	 
							callback: function(r) {
                    	console.log(r.message)

                    	frappe.model.set_value(cdt, cdn, 'name1',r.message["title"]);               	 
                    	frm.refresh_field('name1');
                    	frappe.model.set_value(cdt, cdn, 'city',r.message["city"]);               	 
                    	frm.refresh_field('city');    
                    	frappe.model.set_value(cdt, cdn, 'address_line1',r.message["address1"]);               	 
                    	frm.refresh_field('address_line1');    
                    	frappe.model.set_value(cdt, cdn, 'address_line2',r.message["address2"]);               	 
                    	frm.refresh_field('address_line1');
                    	frappe.model.set_value(cdt, cdn, 'latitude',r.message["lat"]);               	 
                    	frm.refresh_field('latitude');            	 
                    	frappe.model.set_value(cdt, cdn, 'longitude',r.message["lon"]);               	 
                    	frm.refresh_field('longitude');
                    	frappe.model.set_value(cdt, cdn, 'contact',r.message["phone"]);               	 
                    	frm.refresh_field('contact');
                    	frappe.model.set_value(cdt, cdn, 'warehouse',"");               	 
                    	frm.refresh_field('warehouse');
                  	 
                 	 
                   	 
                   	 
							
							}
						})
					}

				},
labour_required: function(frm, cdt, cdn) {
        	const child = locals[cdt][cdn];
        	if (child.labour_required == 1) {
            	addCharge(frm, child, "Labour charge per day (10 hours)");
        	} else {
            	removeSpecificCharge(frm, child.name, "Labour charge per day (10 hours)");
        	}
        	frm.refresh_field('transit_charges');
    	},
    
handling_required: function(frm, cdt, cdn) {
        	const child = locals[cdt][cdn];
        	if (child.handling_required == 1) {
            	addCharge(frm, child, "Container loading/off-loading per 20ft");
        	} else {
            	removeSpecificCharge(frm, child.name, "Container loading/off-loading per 20ft");
        	}
        	frm.refresh_field('transit_charges');
    	},



is_default:function(frm,cdt, cdn) {
        	var child = locals[cdt][cdn];       	 
        	var def=child.is_default

    	if (def==0){



        	frappe.model.set_value(cdt, cdn, 'city',"");               	 
        	frm.refresh_field('city');    
        	frappe.model.set_value(cdt, cdn, 'address_line1',"");               	 
        	frm.refresh_field('address_line1');    
        	frappe.model.set_value(cdt, cdn, 'address_line2',"");               	 
        	frm.refresh_field('address_line1');
        	frappe.model.set_value(cdt, cdn, 'latitude',"");               	 
        	frm.refresh_field('latitude');            	 
        	frappe.model.set_value(cdt, cdn, 'longitude',"");               	 
        	frm.refresh_field('longitude');
        	frappe.model.set_value(cdt, cdn, 'contact',"");               	 
        	frm.refresh_field('contact');
        	frappe.model.set_value(cdt, cdn, 'address',"");               	 
        	frm.refresh_field('address');
    	}
    	if (def==1){

        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_default_address",
            	args: {
                	"doc": frm.doc.party_name,
            	},
            	callback: function(r) {
                	console.log(r.message)
               	 
                	if (r.message) {

                    	frappe.model.set_value(cdt, cdn, 'name1',r.message["title"]);               	 
                    	frm.refresh_field('name1');
                    	frappe.model.set_value(cdt, cdn, 'city',r.message["city"]);               	 
                    	frm.refresh_field('city');    
                    	frappe.model.set_value(cdt, cdn, 'address_line1',r.message["address1"]);               	 
                    	frm.refresh_field('address_line1');    
                    	frappe.model.set_value(cdt, cdn, 'address_line2',r.message["address2"]);               	 
                    	frm.refresh_field('address_line1');
                    	frappe.model.set_value(cdt, cdn, 'latitude',r.message["lat"]);               	 
                    	frm.refresh_field('latitude');            	 
                    	frappe.model.set_value(cdt, cdn, 'longitude',r.message["lon"]);               	 
                    	frm.refresh_field('longitude');
                    	frappe.model.set_value(cdt, cdn, 'contact',r.message["phone"]);               	 
                    	frm.refresh_field('contact');
                    	frappe.model.set_value(cdt, cdn, 'address',r.message["name"]);               	 
                    	frm.refresh_field('address');

               	 
							}
					
						}
					})

		}

		},
 
onload: function(frm) {

			
				// Delay to ensure that the grid is fully loaded
				setTimeout(function() {
					if(frm.fields_dict['receiver_information'] && frm.fields_dict['receiver_information'].grid.get_field('order_no')) {
						frm.fields_dict['receiver_information'].grid.get_field('order_no').df.read_only = true;
					}
				}, 1000); // Adjust the delay time as needed
			},
			refresh: function(frm) {
				update_order_no(frm);
			},
			transit_type:function(frm) {
				update_order_no(frm);
			},
			receiver_information_add: function(frm, cdt, cdn) {
				update_order_no(frm);
			},
			receiver_information_remove: function(frm, cdt, cdn) {
				
				console.log(child);
				update_order_no(frm);
			
			},
		})

// Additional Servicess 1
function updateTransitCharges(frm, cdt, cdn) {
			const child = locals[cdt][cdn];
			const item_selected = child.additional_service_1;
			

		
				if (child.additional_service_1 == ""){
				
					if (child.id1){
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id1);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('transit_charges');
							
							}
						
					
						const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id1);
						if (rowIdx !== -1) {
							
							// Remove the row from the 'transit_charges' table
							frm.doc.transit_charges.splice(rowIdx, 1);
						

							frm.refresh_field('transit_charges');
						
						
						}
					
						
		
					}
					child.additional_service_1_quantity = "";
					child.additional_service_1_rate = "";
					child.amount = "";
					child.id1 = ""
				
					frm.refresh_field("receiver_information");
					
		
				}
				
			
			const quantity = child.additional_service_1_quantity;
			const amount = child.amount;
			if (item_selected && quantity && frm.doc.party_name){
			frappe.call({
				method: "a3trans.a3trans.events.opportunity.get_rate",
            	args: {
                	"itm": item_selected,
					"qty": quantity,
					"customer":frm.doc.party_name

            	},
            	callback: function(r) {
                	console.log(r.message)
					child.additional_service_1_rate = r.message.rate
					child.amount =r.message.amount
					frm.refresh_field("receiver_information")
					if (!child.id1) {
						// If labour_id is not set, add a new row
						const target_row = frm.add_child('transit_charges');
						target_row.charges = item_selected;
						target_row.quantity = quantity;
						target_row.cost = r.message.amount;
						child.id1 = target_row.idx;
						target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
						frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				
						frm.refresh_field('transit_charges');
					} else {
						// If labour_id is already set, update the existing row
						const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id1);
						if (existing_row) {
							if (item_selected) {
								existing_row.charges = item_selected;
								existing_row.quantity = quantity;
								existing_row.cost = r.message.amount;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								frm.refresh_field('transit_charges');
							}
						}
					}



				}


			})
		}
			
		}
		
// Additional Servicess 2
		function updateTransitCharges2(frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		const item_selected = child.additional_service_2;

		if (child.additional_service_2 == ""){
				
			if (child.id2){
				// Find the index of the row in the 'transit_charges' table
				const rowIdx = frm.doc.transit_charges.findIndex(row => row.idx === child.id2);
				if (rowIdx !== -1) {
					// Remove the row from the 'transit_charges' table
					frm.doc.transit_charges.splice(rowIdx, 1);
					frm.refresh_field('transit_charges');
				
				}

			}
			child.additional_service_2_quantity = "";
			child.additional_service_2_rate = "";
			child.amount_2 = "";
			child.id2 = ""
			frm.refresh_field("receiver_information");

		}
		const quantity = child.additional_service_2_quantity;
		const amount = child.amount_2;

		if (item_selected && quantity && frm.doc.party_name){

		frappe.call({
			method: "a3trans.a3trans.events.opportunity.get_rate",
			args: {
				"itm": item_selected,
				"qty": quantity,
				"customer":frm.doc.party_name

			},

			callback: function(r) {
				console.log(r.message,"##########33")
				child.additional_service_2_rate = r.message.rate
				child.amount_2 = r.message.amount
				frm.refresh_field("receiver_information")
				if (!child.id2) {
					// If labour_id is not set, add a new row
					const target_row = frm.add_child('transit_charges');
					target_row.charges = item_selected;
					target_row.quantity = quantity;
					target_row.cost = r.message.amount;
					child.id2 = target_row.idx;
					target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
					frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
					frm.refresh_field('transit_charges');
				} else {
					// If labour_id is already set, update the existing row
					const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id2);
					if (existing_row) {
						if (item_selected) {
							existing_row.charges = item_selected;
							existing_row.quantity = quantity;
							existing_row.cost = r.message.amount;
							frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
							frm.refresh_field('transit_charges');
								}
							}
						}
					}


				})
				}
			}
	
// Additional Servicess 3
function updateTransitCharges3(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.additional_service_3;
	
	const quantity = child.additional_service_3_quantity;
	const amount = child.amount3;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.additional_service_3_rate = r.message.rate
			child.amount3 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id3) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id3 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id3);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}
// Additional Servicess 4
function updateTransitCharges4(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.additional_services_4;
	const quantity = child.additional_service_4_quantity;
	const amount = child.amount4;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate4 = r.message.rate
			child.amount4 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id4) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id4 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id4);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}
// Additional Servicess 5
function updateTransitCharges5(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.service_5;
	const quantity = child.quantity_5;
	const amount = child.amount5;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate5 = r.message.rate
			child.amount5 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id5) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id5 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id5);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}

// Additional Servicess 6
function updateTransitCharges6(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.service6;
	const quantity = child.quantity_6;
	const amount = child.amount6;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate6 = r.message.rate
			child.amount6 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id6) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id6 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id6);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}



// Additional Servicess 7
function updateTransitCharges7(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.service7;
	const quantity = child.quantity7;
	const amount = child.amount7;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate7 = r.message.rate
			child.amount7 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id7) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id7 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id7);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}
// Additional Servicess 8
function updateTransitCharges8(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.service8;
	const quantity = child.quantity8;
	const amount = child.amount8;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate8 = r.message.rate
			child.amount8 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id8) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id8 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id8);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}
// Additional Servicess 9
function updateTransitCharges9(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.service9;
	const quantity = child.quantity9;
	const amount = child.amount9;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate9 = r.message.rate
			child.amount9 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id9) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id9 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id9);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}
// Additional Servicess 10
function updateTransitCharges10(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.service10;
	const quantity = child.quantity10;
	const amount = child.amount10;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate10 = r.message.rate
			child.amount10 = r.message.amount
			frm.refresh_field("receiver_information")
			if (!child.id10) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('transit_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id10 = target_row.idx;
				target_row.description = "Services for " + child.transit_type + " Location " + child.zone;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('transit_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.transit_charges.find(row => row.idx === child.id10);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('transit_charges');
							}
						}
					}
				}


			})
			}
		}
// Helper function to add a charge
				function addCharge(frm, child, chargeName) {
					// Check if the row is already there with the same reference and specific charge
					if (!findSpecificChargeRow(frm, child.name, chargeName)) {
						const target_row = frm.add_child('transit_charges');
						target_row.charges = chargeName;
						target_row.source_name = child.name; // Use this as a unique reference
						frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
					}
				}

				// Helper function to find the specific charge row by source row's name/reference and specific charge
				function findSpecificChargeRow(frm, sourceName, chargeName) {
					return frm.doc.transit_charges && frm.doc.transit_charges.find(row => row.source_name === sourceName && row.charges === chargeName);
				}

				// Helper function to remove a specific charge row based on source row's name/reference and specific charge
				function removeSpecificCharge(frm, sourceName, chargeName) {
					const targetRow = findSpecificChargeRow(frm, sourceName, chargeName);
					if (targetRow) {
						frm.get_field('transit_charges').grid.grid_rows_by_docname[targetRow.name].remove();
					}
				}
				function update_order_no(frm) {
					var index = 1;
					$.each(frm.doc.receiver_information || [], function(i, row) {
						frappe.model.set_value(row.doctype, row.name, 'order_no', index);
						index++;
					});
					frm.refresh_field('receiver_information');
				}



frappe.ui.form.on('Opportunity', {

from_location:function(frm){

	const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
		frm.set_value("table_length",zones.length)
	
		
		if (!frm.doc.transit_charges) {
			frm.doc.transit_charges = [];
		}
	
		if (zones.length >= 3) {
			// Calculate cost and add transportation charge
			let from_zone = frm.doc.from_location;
			let to_zone = frm.doc.to_location;
			if (frm.doc.vehicle_type) {
			   
				frappe.call({
					method: "a3trans.a3trans.events.opportunity.calculate_transportation_cost",
					args: {
						"customer": frm.doc.party_name,
						"zone": JSON.stringify([from_zone, to_zone]),
						"vehicle_type": frm.doc.vehicle_type,
						"booking_type":frm.doc.booking_type
					
					},
					callback: function(response) {
						
						if (response.message) {
							
								
							if (!frm.doc.trans_id) {
								console.log(response.message)
								const target_row = frm.add_child('transit_charges');
								target_row.charges = response.message.bill_item;
								target_row.quantity = 1;
								target_row.from_zone = from_zone;
								target_row.to_zone = to_zone;
								frm.doc.trans_id=target_row.idx
								target_row.description=from_zone+" "+"to"+" "+ to_zone;
								target_row.cost = response.message.amount;
								frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
								frm.refresh_field('transit_charges');
							}
							else{
								var existing_row = frm.doc.transit_charges.find(row => row.idx === frm.doc.trans_id);
								if (existing_row){
						
								existing_row.cost = response.message.amount;
								existing_row.description=from_zone+" "+"to"+" "+ to_zone;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								frm.refresh_field('transit_charges');
								}
								else{
									
							
										const target_row = frm.add_child('transit_charges');
										
										target_row.cost = 0;
										frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
										frm.refresh_field('transit_charges');
												
														
											}
				
											
										}
				
									}
									
								}
							});
						}
					}
			},
to_location:function(frm){
	const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
		frm.set_value("table_length",zones.length)
	
		
		if (!frm.doc.transit_charges) {
			frm.doc.transit_charges = [];
		}
	
		if (zones.length >= 3) {
			// Calculate cost and add transportation charge
			let from_zone = frm.doc.from_location;
			let to_zone = frm.doc.to_location;
			if (frm.doc.vehicle_type) {
			   
				frappe.call({
					method: "a3trans.a3trans.events.opportunity.calculate_transportation_cost",
					args: {
						"customer": frm.doc.party_name,
						"zone": JSON.stringify([from_zone, to_zone]),
						"vehicle_type": frm.doc.vehicle_type,
						"booking_type": frm.doc.booking_type
						
					},
					callback: function(response) {
						
						if (response.message) {
							
								
							if (!frm.doc.trans_id) {
								console.log(response.message)
								const target_row = frm.add_child('transit_charges');
								target_row.charges = response.message.bill_item;
								target_row.quantity = 1;
								target_row.from_zone = from_zone;
								target_row.to_zone = to_zone;
								frm.doc.trans_id=target_row.idx
								target_row.cost = response.message.amount;
								target_row.description=from_zone+" "+"to"+" "+ to_zone;
								frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
								frm.refresh_field('transit_charges');
							}
							else{
								var existing_row = frm.doc.transit_charges.find(row => row.idx === frm.doc.trans_id);
								if (existing_row){
						
								existing_row.cost = response.message.amount;
								existing_row.description=from_zone+" "+"to"+" "+ to_zone;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								frm.refresh_field('transit_charges');
								}
								else{
									
							
										const target_row = frm.add_child('transit_charges');
										
										target_row.cost = 0;
										frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
										frm.refresh_field('transit_charges');
												
											
								}
	
								
							}
	
						}
						
					}
				});
			}
			else{
				frappe.throw("Please add vehicle type")
			}
		}

},
 
customer_name:function(frm){
   
	if (frm.doc.customer_name && frm.doc.party_name==""){
    	frm.set_value("party_name",frm.doc.customer_name)
    	frm.refresh_field("party_name")
	}

},

onload: function(frm) {
	if  (frm.is_new()){
		ind = 1
	if (frm.doc.lead_id) {
    	console.log(frm.doc.lead_id, );

    	frappe.call({
        	method: "a3trans.a3trans.events.lead.get_location",
        	args: {
            	"doc": frm.doc.lead_id
        	},
        	callback: function(r) {
            	console.log(r.message["to"]);
            	if (r.message && frm.doc.booking_type === "Transport") {
					if (!frm.doc.receiver_information){
                	// Add a "Pickup" row
                	const pickup_row = frm.add_child('receiver_information');
					
                	pickup_row.transit_type = "Pickup";
                	pickup_row.order_no=1
                	pickup_row.zone = r.message["from"];

                	// Add a "Dropoff" row
                	const dropoff_row = frm.add_child('receiver_information');
                	dropoff_row.transit_type = "Dropoff";
                	dropoff_row.order_no=2
                	dropoff_row.zone = r.message["to"];
                	frm.script_manager.trigger('order_no', dropoff_row.doctype, dropoff_row.name);
                	frm.script_manager.trigger('zone', dropoff_row.doctype, dropoff_row.name);

                	frm.refresh_field("receiver_information");
					}
					}
				}
			});
		}
		}
		 
        if (frm.doc.transit_details_item){
            console.log(frm.doc.transit_details_item[frm.doc.transit_details_item.length - 1])
            ind = parseInt(frm.doc.transit_details_item[frm.doc.transit_details_item.length - 1].index ) + 1
        }
		frm.fields_dict['order_id'].get_query = function(doc, cdt, cdn) {
			return {
				filters: [
					['order_status', 'in', ['New', 'Vehicle Assigned']]
				]
			};
		};


   	 
    	if (frm.doc.customer_name && frm.doc.party_name==""){
        	frm.set_value("party_name",frm.doc.customer_name)
        	frm.refresh_field("party_name")
    	}
    	if (frm.doc.booking_type == "Packing and Moving") {

       	 
        	frm.fields_dict['packing_items'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
          	 
            	return {
                	filters: {
                    	"item_group": ["in", "Packing and Moving"]
                	}
            	};
        	};
    	}
 	 
    	if (frm.doc.booking_type !== "Diesel") {
      	 
        	frm.fields_dict['shipment_details'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
           	 
            	return {
                	filters: {
                    	"item_group": ["not in", ["Diesel", "Packing and Moving"]],
                    	"is_stock_item": 1
                	}
            	};
        	};
    	}

   	 
      	 
        	frm.fields_dict['transit_charges'].grid.get_field('charges').get_query = function(doc, cdt, cdn) {
           	 
            	return {
                	filters: {
                    	"is_stock_item": 0
                	}
            	};
        	}


        	frm.fields_dict['warehouse_space_details'].grid.get_field('rental_charges').get_query = function(doc, cdt, cdn) {
           	 
            	return {
                	filters: {
                    	"item_group": "Space Rent"
                	}
            	};
        	}
     	 
      	 
            	frm.fields_dict['warehouse_stock_items'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
               	 
                	return {
                    	filters: {
                        	"item_group": ["not in", ["Diesel", "Packing and Moving"]],
                        	"is_stock_item": 1
                    	}
                	};
            	};


			
           	 
       			// frm.fields_dict['warehouse_space_details'].grid.get_field('main_warehouse').get_query = function(doc, cdt, cdn) {
               	 
            	// 	return {
            	//     	filters: {
                       	 
            	//         	"is_group": 1
            	//     	}
            	// 	};
            	// };
           	 
            	// frm.fields_dict['warehouse_space_details'].grid.get_field('floor_id').get_query = function(doc, cdt, cdn) {
            	// 	// get the current row object
            	// 	let row = locals[cdt][cdn];
           	 
            	// 	return {
            	//     	filters: {
            	//         	"warehouse": row.main_warehouse
            	//     	}
            	// 	}
            	// };

            	// frm.fields_dict['warehouse_space_details'].grid.get_field('zone').get_query = function(doc, cdt, cdn) {
            	// 	// get the current row object
            	// 	let row = locals[cdt][cdn];
           	 
            	// 	return {
            	//     	filters: {

            	//         	"floor": row.floor_id,
            	//         	"warehouse": row.main_warehouse
            	//     	}
            	// 	}
            	// }
            	// frm.fields_dict['warehouse_space_details'].grid.get_field('shelf_id').get_query = function(doc, cdt, cdn) {
            	// 	// get the current row object
            	// 	let row = locals[cdt][cdn];
           	 
            	// 	return {
            	//     	filters: {

            	//         	"floor_id": row.floor_id,
            	//         	"warehouse": row.main_warehouse,
            	//         	"zone":row.zone
            	//     	}
            	// 	}
            	// }

            	// frm.fields_dict['warehouse_space_details'].grid.get_field('rack_id').get_query = function(doc, cdt, cdn) {
            	// 	// get the current row object
            	// 	let row = locals[cdt][cdn];
           	 
            	// 	return {
            	//     	filters: {

            	//         	"warehouse_shelf": row.shelf_id,
            	//         	"warehouse": row.main_warehouse,
                     	 
            	//     	}
            	// 	}
            	// }
   	 
			},
			receiver_information_add: function(frm, cdt, cdn) {
				refresh_order_no(frm);
			},
			// Trigger when a row is removed from 'receiver_information'
			receiver_information_remove: function(frm, cdt, cdn) {
			
				refresh_order_no(frm);
			}
			
		})

frappe.ui.form.on('Warehouse Space Details', {
	warehouse: function(frm, cdt, cdn) {
          	 
            	var child = locals[cdt][cdn]
				var today = new Date();

				// Set the day to the last day of the current month
				today.setMonth(today.getMonth() + 1);  // Move to the next month
				today.setDate(0);  // Set to the last day of the previous month
				
				// Calculate the time difference in milliseconds
				var timeDifference = today - new Date();
				
				// Convert the time difference to days
				var daysDifference = timeDifference / (1000 * 60 * 60 * 24);
				
				// Round the result to get a whole number of days
				daysDifference = Math.round(daysDifference);
				
				console.log("Days difference between today and the last day of the current month: " + daysDifference + " days");
				
				// Convert the date object to a string in 'yyyy-mm-dd' format
				var lastDayOfMonth = today.toISOString().split('T')[0];
				
				// Set the last day of the current month as the default value
				child.booked_upto = lastDayOfMonth;
				child.no_of_days = daysDifference
				child.rental_charges = "Warehouse Space Rent"
				
				frm.refresh_field("warehouse_space_details")
            	// Fetch additional details using the warehouse value
            	if (child.warehouse) {
                	frappe.call({
                    	method: "a3trans.a3trans.events.opportunity.get_warehouse_data",
                    	args: {
                     	 
                        	"doc": child.warehouse
                    	},
                    	callback: function(r) {
                        	if (r.message) {
                            	console.log(r.message)
                            	frappe.model.set_value(cdt, cdn, "floor_id", r.message["floor"]);
                            	frm.refresh_field('floor_id');
                            	frappe.model.set_value(cdt, cdn, 'zone',r.message["zone"]);
                            	frm.refresh_field('zone');
                            	frappe.model.set_value(cdt, cdn, 'shelf_id',r.message["shelf"]);
                            	frm.refresh_field('shelf_id');
                            	frappe.model.set_value(cdt, cdn, 'rack_id',r.message["rack"]);
                            	frm.refresh_field('rack_id');
								
							  
                          	 
                        	}
                    	}
                	});
            	}
     	 
	 
    	if (!child.date_from) {
        	// Set the current date as the default value for date_from
        	frappe.model.set_value(cdt, cdn, 'date_from', frappe.datetime.now_date());
        	frm.refresh_field('date_from');
       	 
    	}
    	if (child.warehouse==""){
        	frappe.model.set_value(cdt, cdn, 'floor_id',"");
        	frm.refresh_field('floor_id');
        	frappe.model.set_value(cdt, cdn, 'zone',"");
        	frm.refresh_field('zone');
        	frappe.model.set_value(cdt, cdn, 'shelf_id',"");
        	frm.refresh_field('shelf_id');
        	frappe.model.set_value(cdt, cdn, 'rack_id',"");
        	frm.refresh_field('rack_id');
 
 
    	}
	},
	// date_from:function(frm, cdt, cdn) {
	// 	var child = locals[cdt][cdn];
	// 	if (!child.date_to) {
	//     	// Set the current date as the default value for date_from
	//     	// frappe.model.set_value(cdt, cdn, 'date_to', frappe.datetime.now_date());
	//     	// frm.refresh_field('date_to');
	//     	frappe.call({
	//         	method: "a3trans.a3trans.events.opportunity.get_end_of_month",
	//         	args: {
	//             	current_date_str:frappe.datetime.now_date()
	//         	},
	//         	callback: function(response) {
	//             	console.log(response.message["end_month"])
	//             	// Handle callback response if needed
	//             	frappe.model.set_value(cdt, cdn, 'date_to',response.message["end_month"]);
	//             	frm.refresh_field('date_to');
	//             	frappe.model.set_value(cdt, cdn, 'no_of_days',response.message["difference"]);
	//             	frm.refresh_field('no_of_days');
	//             	frappe.model.set_value(cdt, cdn, 'rental_charges',"Warehouse Space Rent");
	//             	frm.refresh_field('rental_charges');
	//         	}
	//     	});
	// 	}
	// },

	booked_upto:function(frm, cdt, cdn) {
    	var child = locals[cdt][cdn];
    	// if (!child.date_to) {
        	// Set the current date as the default value for date_from
        	// frappe.model.set_value(cdt, cdn, 'date_to', frappe.datetime.now_date());
        	// frm.refresh_field('date_to');
			if(child.booked_upto){
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.get_end_of_month",
            	args: {
                	current_date_str:frappe.datetime.now_date(),
                	booked_upto:child.booked_upto
            	},
            	callback: function(response) {
                	console.log(response.message["end_month"])
                	// Handle callback response if needed
                	frappe.model.set_value(cdt, cdn, 'date_to',response.message["end_month"]);
                	frm.refresh_field('date_to');
                	if(response.message["difference"]<0){
                    	frappe.model.set_value(cdt, cdn, 'no_of_days',0);
                    	frm.refresh_field('no_of_days');
                    	frappe.throw("Booking to Date can't be lower than Current Date")
                	}
                	else{
                	frappe.model.set_value(cdt, cdn, 'no_of_days',response.message["difference"]);
                	frm.refresh_field('no_of_days');
                	}
                	frappe.model.set_value(cdt, cdn, 'rental_charges',"Warehouse Space Rent");
                	frm.refresh_field('rental_charges');
            	}
        	});
    	}
	},
	rate_per_day:function(frm, cdt, cdn) {
    	frm.clear_table("warehouse_charges")
    	var child = locals[cdt][cdn];
    	if (child.no_of_days){
    	var no_of_days = child.no_of_days;
    	}
    	var selected_item=child.rental_charges
    	console.log(child.rental_charges)
    	const target_row=frm.add_child('warehouse_charges')
   	 target_row.charges=selected_item
    	target_row.quantity=1
    	// frm.refresh_field('warehouse_charges');
    	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
  	 
    	if (child.uom=="Cubic Meter"){
        	var type=child.cargo_type
    	}
    	else{
        	var type="NIL"
    	}
   	 
    	frappe.call({
        	method: "a3trans.a3trans.events.opportunity.calculate_charges",
        	args: {
            	no_of_days: no_of_days, // Pass no_of_days as an argument
            	selected_item:selected_item,
            	uom:child.uom,
            	customer:frm.doc.party_name,
            	area:child.required_area,
            	rate_month:child.rate_per_month,
            	rate_day:child.rate_per_day,
            	types:type

        	},
        	callback: function(response) {
            	if (response.message){
               	console.log("hiiii",response.message)
            	frappe.model.set_value(cdt, cdn, 'rental_cost',response.message["total_amount"]);
                	frm.refresh_field('rental_cost');
                	target_row.cost = child.rental_cost;
                	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                	frm.refresh_field("warehouse_charges")
            	}
        	else{
           	 
            	frappe.model.set_value(cdt, cdn, 'rental_cost',"");
            	frm.refresh_field('rental_cost');
            	target_row.cost = child.rental_cost;
            	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
            	frm.refresh_field("warehouse_charges")  
        	}
           	 
        	}
    	});
  	 
	},


	rate_per_month:function(frm, cdt, cdn) {
    	frm.clear_table("warehouse_charges")
    	var child = locals[cdt][cdn];
    	if (child.no_of_days){
    	var no_of_days = child.no_of_days;
    	}
    	var selected_item=child.rental_charges
    	console.log(child.rental_charges)
    	const target_row=frm.add_child('warehouse_charges')
   	 target_row.charges=selected_item
    	target_row.quantity=1
    	// frm.refresh_field('warehouse_charges');
    	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
  	 
    	if (child.uom=="Cubic Meter"){
        	var type=child.cargo_type
    	}
    	else{
        	var type="NIL"
    	}
   	 
    	frappe.call({
        	method: "a3trans.a3trans.events.opportunity.calculate_charges",
        	args: {
            	no_of_days: no_of_days, // Pass no_of_days as an argument
            	selected_item:selected_item,
            	uom:child.uom,
            	customer:frm.doc.party_name,
            	area:child.required_area,
            	rate_month:child.rate_per_month,
            	rate_day:child.rate_per_day,
            	types:type

        	},
        	callback: function(response) {
            	if (response.message){
               	console.log("hiiii",response.message)
            	frappe.model.set_value(cdt, cdn, 'rental_cost',response.message["total_amount"]);
                	frm.refresh_field('rental_cost');
                	target_row.cost = child.rental_cost;
                	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                	frm.refresh_field("warehouse_charges")
            	}
        	else{
           	 
            	frappe.model.set_value(cdt, cdn, 'rental_cost',"");
            	frm.refresh_field('rental_cost');
            	target_row.cost = child.rental_cost;
            	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
            	frm.refresh_field("warehouse_charges")  
        	}
           	 
        	}
    	});
  	 
	},

	uom: function(frm, cdt, cdn) {
    	frm.clear_table("warehouse_charges")
    	var child = locals[cdt][cdn];
    	if (child.no_of_days){
    	var no_of_days = child.no_of_days;
    	}
    	var selected_item=child.rental_charges
    	console.log(child.rental_charges)
    	const target_row=frm.add_child('warehouse_charges')
   	 target_row.charges=selected_item
    	target_row.quantity=1
    	// frm.refresh_field('warehouse_charges');
    	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
  	 
    	if (child.uom=="Cubic Meter"){
        	var type=child.cargo_type
    	}
    	else{
        	var type="NIL"
    	}
   	 
    	frappe.call({
        	method: "a3trans.a3trans.events.opportunity.calculate_charges",
        	args: {
            	no_of_days: no_of_days, // Pass no_of_days as an argument
            	selected_item:selected_item,
            	uom:child.uom,
            	customer:frm.doc.party_name,
            	area:child.required_area,
            	rate_month:child.rate_per_month,
            	rate_day:child.rate_per_day,
            	types:type

        	},
        	callback: function(response) {
            	if (response.message){
               	console.log("hiiii",response.message)
            	frappe.model.set_value(cdt, cdn, 'rental_cost',response.message["total_amount"]);
                	frm.refresh_field('rental_cost');
                	target_row.cost = child.rental_cost;
                	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                	frm.refresh_field("warehouse_charges")
            	}
        	else{
           	 
            	frappe.model.set_value(cdt, cdn, 'rental_cost',"");
            	frm.refresh_field('rental_cost');
            	target_row.cost = child.rental_cost;
            	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
            	frm.refresh_field("warehouse_charges")  
        	}
           	 
        	}
    	});
  	 
	},


required_area: function(frm, cdt, cdn) {
    	frm.clear_table("warehouse_charges")
    	var child = locals[cdt][cdn];
    	if (child.no_of_days){
    	var no_of_days = child.no_of_days;
    	}
    	var selected_item=child.rental_charges
    	console.log(child.rental_charges)
    	const target_row=frm.add_child('warehouse_charges')
   	 target_row.charges=selected_item
    	target_row.quantity=1
    	// frm.refresh_field('warehouse_charges');
    	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
  	 
    	if (child.uom=="Cubic Meter"){
        	var type=child.cargo_type
    	}
    	else{
        	var type="NIL"
    	}
   	 
    	frappe.call({
        	method: "a3trans.a3trans.events.opportunity.calculate_charges",
        	args: {
            	no_of_days: no_of_days, // Pass no_of_days as an argument
            	selected_item:selected_item,
            	uom:child.uom,
            	customer:frm.doc.party_name,
            	area:child.required_area,
            	rate_month:child.rate_per_month,
            	rate_day:child.rate_per_day,
            	types:type

        	},
        	callback: function(response) {
            	if (response.message){
               	console.log("hiiii",response.message)
            	frappe.model.set_value(cdt, cdn, 'rental_cost',response.message["total_amount"]);
                	frm.refresh_field('rental_cost');
                	target_row.cost = child.rental_cost;
                	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                	frm.refresh_field("warehouse_charges")
            	}
        	else{
           	 
            	frappe.model.set_value(cdt, cdn, 'rental_cost',"");
            	frm.refresh_field('rental_cost');
            	target_row.cost = child.rental_cost;
            	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
            	frm.refresh_field("warehouse_charges")  
        	}
           	 
        	}
    	});
  	 
	},

 });


 frappe.ui.form.on('Transit Charges', {


	cost: function(frm, cdt, cdn) {
	
		

        	let aggregated_items = {}; // Object to store aggregated values.
  	 
        	// Loop through each row in warehouse charges
        	$.each(frm.doc.transit_charges || [], function(i, charge) {
            	if (charge.charges) {
                	if (aggregated_items[charge.charges]) {
                    	// Aggregate if item already exists
                    	aggregated_items[charge.charges].quantity += charge.quantity;
                    	aggregated_items[charge.charges].amount += charge.cost;
                	} else {
                    	// Or, create a new aggregated entry
                    	aggregated_items[charge.charges] = {
                        	item: charge.charges,
                        	quantity: charge.quantity,
                        	amount: charge.cost,
                        	warehouse_charge_ref: charge.name
                    	};
                	}
            	}
        	});
        	$.each(frm.doc.warehouse_charges || [], function(i, charge) {
            	if (charge.charges) {
                	if (aggregated_items[charge.charges]) {
            	console.log(aggregated_items)
                    	// Aggregate if item already exists
                    	aggregated_items[charge.charges].quantity += charge.quantity;
                    	aggregated_items[charge.charges].amount += charge.cost;
                	} else {
                    	// Or, create a new aggregated entry
                        	aggregated_items[charge.charges] = {
                        	item: charge.charges,
                        	quantity: charge.quantity,
                        	amount: charge.cost,
                        	warehouse_charge_ref: charge.name
                    	};
                	}
            	}
        	});
  	 
        	// Clear the existing opportunity_line_item table
        	frm.doc.opportunity_line_item = [];
  	 
        	// Populate the opportunity_line_item table with aggregated values
        	for (let item in aggregated_items) {
            	let target_row = frm.add_child('opportunity_line_item');
            	target_row.item = aggregated_items[item].item;
            	target_row.quantity = aggregated_items[item].quantity;
            	target_row.amount = aggregated_items[item].amount;
            	target_row.average_rate = target_row.amount / target_row.quantity;
            	target_row.warehouse_charge_ref = aggregated_items[item].warehouse_charge_ref;
  	 
            	frm.script_manager.trigger('amount', target_row.doctype, target_row.name);
        	}
  	 
        	frm.refresh_field('opportunity_line_item');
    	},
	transit_charges_remove: function(frm, cdt, cdn) {
    	const groupedDatas = {};
    	// Group by items in transit_charges
    	$.each(frm.doc.transit_charges, function(_, charge) {
        	if (charge.charges) {
            	if (!groupedDatas[charge.charges]) {
                	groupedDatas[charge.charges] = {
                    	quantity: 0,
                    	amount: 0,
                    	average_rate: 0,
                    	transit_charge_refs: []
                	};
            	}
            	groupedDatas[charge.charges].quantity += charge.quantity;
            	groupedDatas[charge.charges].amount += charge.cost;
            	groupedDatas[charge.charges].transit_charge_refs.push(charge.name);
            	console.log("Transit remove")
        	}
    	});
    	$.each(frm.doc.warehouse_charges, function(_, charge) {
        	if (charge.charges) {
            	if (!groupedDatas[charge.charges]) {
                	groupedDatas[charge.charges] = {
                    	quantity: 0,
                    	amount: 0,
                    	average_rate: 0,
                    	transit_charge_refs: []
                	};
            	}
          	 
            	groupedDatas[charge.charges].quantity += charge.quantity;
            	groupedDatas[charge.charges].amount += charge.cost;
            	groupedDatas[charge.charges].transit_charge_refs.push(charge.name);
            	console.log("Warehouse remove",groupedDatas)
        	}
    	});
    	// Update or Add rows in opportunity_line_item
    	for (let item in groupedDatas) {
        	const existing_row = frm.doc.opportunity_line_item.find(row => row.item && row.item === item);
     	 
        	if (existing_row) {
            	existing_row.quantity = groupedDatas[item].quantity;
            	existing_row.amount = groupedDatas[item].amount;
            	existing_row.average_rate = existing_row.amount / existing_row.quantity;
            	frm.script_manager.trigger('amount',existing_row.doctype, existing_row.name);
        	} else {
            	const target_row = frm.add_child('opportunity_line_item');
            	target_row.item = item;
            	target_row.quantity = groupedDatas[item].quantity;
            	target_row.amount = groupedDatas[item].amount;
            	target_row.average_rate = target_row.amount / target_row.quantity;
            	target_row.transit_charge_ref = JSON.stringify(groupedDatas[item].transit_charge_refs);
            	frm.script_manager.trigger('amount', target_row.doctype, target_row.name);
        	}
    	}
    	// Delete rows from opportunity_line_item that are not present in transit_charges
    	for (let i = frm.doc.opportunity_line_item.length - 1; i >= 0; i--) {
        	const row = frm.doc.opportunity_line_item[i];
        	if (!groupedDatas[row.item]) {
           	 
            	frm.get_field('opportunity_line_item').grid.grid_rows[i].remove();
        	}
      	 
    	}
    	frm.refresh_field('opportunity_line_item');
 	 
	},
 
	charges: function(frm, cdt, cdn) {
    	const charges_row = locals[cdt][cdn];
    	const oldChargesValue = charges_row.__original ? charges_row.__original.charges : null;

    	if (oldChargesValue) {
        	const existing_row = frm.doc.opportunity_line_item.find(row => row.item === oldChargesValue);
        	if (existing_row) {
            	existing_row.item = charges_row.charges;
            	frm.refresh_field('opportunity_line_item');
        	}
    	}

    	if (charges_row.charges) {
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.fetch_charges_price",
            	args: {
                	charges: charges_row.charges
            	},
            	callback: function(response) {
                	if (response && response.message) {
						console.log(response.message,"$$$",response.message["item_group"])
                    	frappe.model.set_value(cdt, cdn, 'cost', response.message["price_list_rate"]);
                    	frappe.model.set_value(cdt, cdn, 'quantity', 1);
						frappe.model.set_value(cdt, cdn, 'description',response.message["item_group"]);
                		
                	}
            	}
        	});
    	}
	},
	
     	
});

// function calculateTotalAmount(frm) {
// 	let totalAmount = 0;
// 	if (frm.doc.opportunity_line_item && Array.isArray(frm.doc.opportunity_line_item)) {
//     	frm.doc.opportunity_line_item.forEach(row => {
//         	totalAmount += row.amount;
//     	});
// 	}
 
 
// 	// Update the payment_amount field with the totalAmount
// 	frm.set_value('payment_amount', totalAmount);
//  }
 
frappe.ui.form.on('Warehouse Stock Items', {
	service1: function (frm, cdt, cdn) {
		
        updateWarehouseCharges1(frm, cdt, cdn);
			
    },

    qty1: function (frm, cdt, cdn) {
        updateWarehouseCharges1(frm, cdt, cdn);
    },

    amount: function (frm, cdt, cdn) {
        updateWarehouseCharges1(frm, cdt, cdn);
    },
	service2: function (frm, cdt, cdn) {
		
        updateWarehouseCharges2(frm, cdt, cdn);
				

    },

    qty2: function (frm, cdt, cdn) {
        updateWarehouseCharges2(frm, cdt, cdn);
    },

    amount2: function (frm, cdt, cdn) {
        updateWarehouseCharges2(frm, cdt, cdn);
    },
	service3: function (frm, cdt, cdn) {
		
        updateWarehouseCharges3(frm, cdt, cdn);
			
    },

    qty3: function (frm, cdt, cdn) {
        updateWarehouseCharges3(frm, cdt, cdn);
    },

    amount3: function (frm, cdt, cdn) {
        updateWarehouseCharges3(frm, cdt, cdn);
    },

	service4: function (frm, cdt, cdn) {
		
        updateWarehouseCharges4(frm, cdt, cdn);
			
    },

    qty4: function (frm, cdt, cdn) {
        updateWarehouseCharges4(frm, cdt, cdn);
    },

    amount4: function (frm, cdt, cdn) {
        updateWarehouseCharges4(frm, cdt, cdn);
    },
	service5: function (frm, cdt, cdn) {
		
        updateWarehouseCharges5(frm, cdt, cdn);
				

    },

    qty5: function (frm, cdt, cdn) {
        updateWarehouseCharges5(frm, cdt, cdn);
    },

    amount5: function (frm, cdt, cdn) {
        updateWarehouseCharges5(frm, cdt, cdn);
    },


	rate:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service1
		const quantity = child.qty1
		if (child.rate){
			var total = (child.rate) * (child.qty1)
			child.amount = total
			frm.refresh_field("warehouse_stock_items")
			const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id1);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('warehouse_charges');
							}
						}
		}

	},
	rate2:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service2
		const quantity = child.qty2
		if (child.rate2){
			var total = (child.rate2) * (child.qty2)
			child.amount2 = total
			frm.refresh_field("warehouse_stock_items")
			const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id2);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('warehouse_charges');
							}
						}
		}

	},
	rate3:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service3
		const quantity = child.qty3
		if (child.rate3){
			var total = (child.rate3) * (child.qty3)
			child.amount3 = total
			frm.refresh_field("warehouse_stock_items")
			const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id3);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('warehouse_charges');
							}
						}
		}

	},
	rate4:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service4
		const quantity = child.qty4
		if (child.rate4){
			var total = (child.rate4) * (child.qty4)
			child.amount4 = total
			frm.refresh_field("warehouse_stock_items")
			const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id4);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('warehouse_charges');
							}
						}
		}

	},
	rate5:function(frm,cdt,cdn){
		const child = locals[cdt][cdn]
		const item_selected = child.service5
		const quantity = child.qty5
		if (child.rate5){
			var total = (child.rate5) * (child.qty5)
			child.amount5 = total
			frm.refresh_field("warehouse_stock_items")
			const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id5);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = total;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('warehouse_charges');
							}
						}
		}

	},
	service1: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.service1 == "") {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id1) {
				
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id1);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('warehouse_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.warehouse_charges.findIndex(row => row.idx === child.id1);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.warehouse_charges.splice(rowIdx, 1);
						frm.refresh_field('warehouse_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service1= "";
			child.qty1 = "";
			child.rate = "";
			child.amount = "";
			child.id1 = ""
			frm.refresh_field("warehouse_stock_items");

		
		}
	},
	add1: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add1 == 0) {
				// Remove the corresponding row from 'warehouse_charges' if it exists
				if (child.id2) {
					
						// Find the index of the row in the 'warehouse_charges' table
						const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id2);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('warehouse_charges');
							
							}
					// Find the index of the row in the 'warehouse_charges' table
					const rowIdx = frm.doc.warehouse_charges.findIndex(row => row.idx === child.id2);
					if (rowIdx !== -1) {
						// Remove the row from the 'warehouse_charges' table
						frm.doc.warehouse_charges.splice(rowIdx, 1);
						frm.refresh_field('warehouse_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service2 = "";
			child.qty2 = "";
			child.rate2 = "";
			child.amount2 = "";
			child.id2 = ""
			frm.refresh_field("warehouse_stock_items");

		
		}
	},
	add2: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add2 == 0) {
				// Remove the corresponding row from 'warehouse_charges' if it exists
				if (child.id3) {
					
						// Find the index of the row in the 'warehouse_charges' table
						const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id3);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('warehouse_charges');
							
							}
					// Find the index of the row in the 'warehouse_charges' table
					const rowIdx = frm.doc.warehouse_charges.findIndex(row => row.idx === child.id3);
					if (rowIdx !== -1) {
						// Remove the row from the 'warehouse_charges' table
						frm.doc.warehouse_charges.splice(rowIdx, 1);
						frm.refresh_field('warehouse_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service3 = "";
			child.qty3 = "";
			child.rate3 = "";
			child.amount3 = "";
			child.id3 = ""
			frm.refresh_field("warehouse_stock_items");

		
		}
	},
	add3: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add3 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id4) {
				
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id4);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('warehouse_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.warehouse_charges.findIndex(row => row.idx === child.id4);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.warehouse_charges.splice(rowIdx, 1);
						frm.refresh_field('warehouse_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service4 = "";
			child.qty4 = "";
			child.rate4 = "";
			child.amount4 = "";
			child.id4 = ""
			frm.refresh_field("warehouse_stock_items");
		
		}
	},
	add4: function (frm, cdt, cdn) {
		const child = locals[cdt][cdn];
		if (child.add4 == 0) {
				// Remove the corresponding row from 'transit_charges' if it exists
				if (child.id5) {
					
						// Find the index of the row in the 'transit_charges' table
						const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id5);
						if (existing_row) {
							
								existing_row.charges = "";
								existing_row.quantity = 0;
								existing_row.cost = 0;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								
								frm.refresh_field('warehouse_charges');
							
							}
					// Find the index of the row in the 'transit_charges' table
					const rowIdx = frm.doc.warehouse_charges.findIndex(row => row.idx === child.id5);
					if (rowIdx !== -1) {
						// Remove the row from the 'transit_charges' table
						frm.doc.warehouse_charges.splice(rowIdx, 1);
						frm.refresh_field('warehouse_charges');
					}
				}
			// Clear the fields associated with additional_service_2
			child.service5= "";
			child.qty5= "";
			child.rate5 = "";
			child.amount5 = "";
			child.id5 = ""
			frm.refresh_field("warehouse_stock_items");

		
		}
	},

	// choose_loading_service: function(frm, cdt, cdn) {
    // 	var child1 = locals[cdt][cdn];
    // 	var item_selected = child1.choose_loading_service;

    // 	if (!child1.load_id) {
    //     	// If labour_id is not set, add a new row
    //     	const target_row = frm.add_child('warehouse_charges');
    //     	target_row.charges = item_selected;
    //     	target_row.quantity = 1;
    //     	child1.load_id = target_row.idx;
    //     	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
    //     	frm.refresh_field('warehouse_charges');
    // 	} else {
    //     	// If labour_id is already set, update the existing row
    //     	var existing_row = frm.doc.warehouse_charges.find(row => row.idx === child1.load_id);
    //     	if (existing_row) {
    //         	existing_row.charges = item_selected;
    //         	frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
    //         	frm.refresh_field('warehouse_charges');
    //     	} 
    // 	}
	// },


	// choose_labour_service: function(frm, cdt, cdn) {
    // 	var child1 = locals[cdt][cdn];
    // 	var item_selected = child1.choose_labour_service;

    // 	if (!child1.labour_id) {
    //     	// If labour_id is not set, add a new row
    //     	const target_row = frm.add_child('warehouse_charges');
    //     	target_row.charges = item_selected;
    //     	target_row.quantity = 1;
    //     	child1.labour_id = target_row.idx;
    //     	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
    //     	frm.refresh_field('warehouse_charges');
    // 	} else {
    //     	// If labour_id is already set, update the existing row
    //     	var existing_row = frm.doc.warehouse_charges.find(row => row.idx === child1.labour_id);
    //     	if (existing_row) {
    //         	existing_row.charges = item_selected;
    //         	frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
    //         	frm.refresh_field('warehouse_charges');
    //     	} 
    // 	}
	// },
	// choose_handling_service: function(frm, cdt, cdn) {
    // 	var child1 = locals[cdt][cdn];
    // 	var item_selected = child1.choose_handling_service;

    // 	if (!child1.handle_id) {
    //     	// If labour_id is not set, add a new row
    //     	const target_row = frm.add_child('warehouse_charges');
    //     	target_row.charges = item_selected;
    //     	target_row.quantity = 1;
    //     	child1.handle_id = target_row.idx;
    //     	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
    //     	frm.refresh_field('warehouse_charges');
    // 	} else {
    //     	// If labour_id is already set, update the existing row
    //     	var existing_row = frm.doc.warehouse_charges.find(row => row.idx === child1.handle_id);
    //     	if (existing_row) {
    //         	existing_row.charges = item_selected;
    //         	frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
    //         	frm.refresh_field('warehouse_charges');
    //     	} 
    // 	}
	// },

    
	// labour_required: function(frm, cdt, cdn) {
	// 	var child = locals[cdt][cdn];
	// 	if (child.labour_required == 1) {
	//     	handleCharges(frm, child, "Labour charge per day (10 hours)", 'add');
	// 	} else if (child.labour_required == 0) {
	//     	handleCharges(frm, child, "Labour charge per day (10 hours)", 'remove');
	// 	}
	// 	frm.refresh_field('warehouse_charges');
	// },
    
	// handling_required: function(frm, cdt, cdn) {
	// 	var child = locals[cdt][cdn];
	// 	if (child.handling_required == 1) {
	//     	handleCharges(frm, child, "Container loading/off-loading per 20ft", 'add');
	// 	} else if (child.handling_required == 0) {
	//     	handleCharges(frm, child, "Container loading/off-loading per 20ft", 'remove');
	// 	}
	// 	frm.refresh_field('warehouse_charges');
	// },

    
	movement_type: function(frm, cdt, cdn) {
    	var child = locals[cdt][cdn];
    	var order_no_sequence = (frm.doc.receiver_information && frm.doc.receiver_information.length > 0) ? frm.doc.receiver_information.length + 1 : 1;
   	 
    	if (child.movement_type) {
        	if (!frm.doc.receiver_information) {
            	frm.doc.receiver_information = [];  // Initializing if not already present
        	}
    
        	$.each(frm.doc.warehouse_space_details, function(i, row) {
            	var target_row = frm.doc.receiver_information.find(r => r.warehouse_charge_ref === child.name);
    
            	if (!target_row) {
                	target_row = frm.add_child('receiver_information');
                	target_row.warehouse_charge_ref = child.name;
                	target_row.order_no = order_no_sequence++;
                	target_row.warehouse = row.warehouse;
            	}
    
            	if (child.movement_type == "Stock IN") {
               	 
                	target_row.transit_type = "Dropoff";

                	var grid_row = locals[cdt][cdn];


                	// var df = frappe.meta.get_docfield("Transit Details","handling_required", cur_frm.doc.name);
                	// df.read_only = 1;

            	} else if (child.movement_type == "Stock OUT") {
                	target_row.transit_type = "Pickup";
            	}
    
            	frm.script_manager.trigger('warehouse', target_row.doctype, target_row.name);
        	})
        	frm.refresh_field("receiver_information");
    	}
	},
    
    
	warehouse_stock_items_remove: function(frm, cdt, cdn) {
    	// Filtering matching rows from 'receiver_information'
    	var matching_rows = frm.doc.receiver_information.filter(row => row.warehouse_charge_ref === cdn);
    
    	// Looping over all matching rows and removing them
    	$.each(matching_rows, function(index, row) {
        	var idx = frm.doc.receiver_information.indexOf(row);
        	if (idx > -1) {
            	frm.doc.receiver_information.splice(idx, 1);
        	}
    	});
    
    	// Renumbering the order_no and idx for the remaining rows
    	$.each(frm.doc.receiver_information, function(index, row) {
        	row.order_no = index + 1;   // Setting the order_no based on the array index
        	row.idx = index + 1;   	// Adjusting the idx property
    	});
    
    	frm.refresh_field('receiver_information');
	}  
});

// Helper function to find the corresponding charge row by source row's name and charge type
function findChargeRowBySourceNameAndCharges(frm, sourceName, chargeType) {
	return frm.doc.warehouse_charges && frm.doc.warehouse_charges.find(row => row.source_name === sourceName && row.charges === chargeType);
}

function handleCharges(frm, child, chargeName, action) {
	if (action === 'add' && !findChargeRowBySourceNameAndCharges(frm, child.name, chargeName)) {
    	const target_row = frm.add_child('warehouse_charges');
    	target_row.charges = chargeName;
    	target_row.source_name = child.name;
    	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
	} else if (action === 'remove') {
    	const targetRow = findChargeRowBySourceNameAndCharges(frm, child.name, chargeName);
    	if (targetRow) {
        	frm.get_field('warehouse_charges').grid.grid_rows_by_docname[targetRow.name].remove();
    	}
	}
}

function updateWarehouseCharges1(frm, cdt, cdn) {
	const child = locals[cdt][cdn];
	const item_selected = child.service1;
	
	const quantity = child.qty1;
	const amount = child.amount;

	if (item_selected && quantity && frm.doc.party_name){

	frappe.call({
		method: "a3trans.a3trans.events.opportunity.get_rate",
		args: {
			"itm": item_selected,
			"qty": quantity,
			"customer":frm.doc.party_name

		},

		callback: function(r) {
			console.log(r.message)
			child.rate = r.message.rate
			child.amount = r.message.amount
			frm.refresh_field("warehouse_stock_items")
			if (!child.id1) {
				// If labour_id is not set, add a new row
				const target_row = frm.add_child('warehouse_charges');
				target_row.charges = item_selected;
				target_row.quantity = quantity;
				target_row.cost = r.message.amount;
				child.id1 = target_row.idx;
				frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
				frm.refresh_field('warehouse_charges');
			} else {
				// If labour_id is already set, update the existing row
				const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id1);
				if (existing_row) {
					if (item_selected) {
						existing_row.charges = item_selected;
						existing_row.quantity = quantity;
						existing_row.cost = r.message.amount;
						frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
						frm.refresh_field('warehouse_charges');
							}
						}
					}
				}


			})
			}
		}


function updateWarehouseCharges2(frm, cdt, cdn) {
			const child = locals[cdt][cdn];
			const item_selected = child.service2;
			
			const quantity = child.qty2;
			const amount = child.amount2;
		
			if (item_selected && quantity && frm.doc.party_name){
		
			frappe.call({
				method: "a3trans.a3trans.events.opportunity.get_rate",
				args: {
					"itm": item_selected,
					"qty": quantity,
					"customer":frm.doc.party_name
		
				},
		
				callback: function(r) {
					console.log(r.message)
					child.rate2 = r.message.rate
					child.amount2 = r.message.amount
					frm.refresh_field("warehouse_stock_items")
					if (!child.id2) {
						// If labour_id is not set, add a new row
						const target_row = frm.add_child('warehouse_charges');
						target_row.charges = item_selected;
						target_row.quantity = quantity;
						target_row.cost = r.message.amount;
						child.id2 = target_row.idx;
						frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
						frm.refresh_field('warehouse_charges');
					} else {
						// If labour_id is already set, update the existing row
						const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id2);
						if (existing_row) {
							if (item_selected) {
								existing_row.charges = item_selected;
								existing_row.quantity = quantity;
								existing_row.cost = r.message.amount;
								frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
								frm.refresh_field('warehouse_charges');
									}
								}
							}
						}
		
		
					})
					}
				}

function updateWarehouseCharges3(frm, cdt, cdn) {
					const child = locals[cdt][cdn];
					const item_selected = child.service3;
					
					const quantity = child.qty3;
					const amount = child.amount3;
				
					if (item_selected && quantity && frm.doc.party_name){
				
					frappe.call({
						method: "a3trans.a3trans.events.opportunity.get_rate",
						args: {
							"itm": item_selected,
							"qty": quantity,
							"customer":frm.doc.party_name
				
						},
				
						callback: function(r) {
							console.log(r.message)
							child.rate3 = r.message.rate
							child.amount3 = r.message.amount
							frm.refresh_field("warehouse_stock_items")
							if (!child.id3) {
								// If labour_id is not set, add a new row
								const target_row = frm.add_child('warehouse_charges');
								target_row.charges = item_selected;
								target_row.quantity = quantity;
								target_row.cost = r.message.amount;
								child.id3 = target_row.idx;
								frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
								frm.refresh_field('warehouse_charges');
							} else {
								// If labour_id is already set, update the existing row
								const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id3);
								if (existing_row) {
									if (item_selected) {
										existing_row.charges = item_selected;
										existing_row.quantity = quantity;
										existing_row.cost = r.message.amount;
										frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
										frm.refresh_field('warehouse_charges');
											}
										}
									}
								}
				
				
							})
							}
						}
function updateWarehouseCharges4(frm, cdt, cdn) {
							const child = locals[cdt][cdn];
							const item_selected = child.service4;
							
							const quantity = child.qty4;
							const amount = child.amount4;
						
							if (item_selected && quantity && frm.doc.party_name){
						
							frappe.call({
								method: "a3trans.a3trans.events.opportunity.get_rate",
								args: {
									"itm": item_selected,
									"qty": quantity,
									"customer":frm.doc.party_name
						
								},
						
								callback: function(r) {
									console.log(r.message)
									child.rate4 = r.message.rate
									child.amount4 = r.message.amount
									frm.refresh_field("warehouse_stock_items")
									if (!child.id4) {
										// If labour_id is not set, add a new row
										const target_row = frm.add_child('warehouse_charges');
										target_row.charges = item_selected;
										target_row.quantity = quantity;
										target_row.cost = r.message.amount;
										child.id4 = target_row.idx;
										frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
										frm.refresh_field('warehouse_charges');
									} else {
										// If labour_id is already set, update the existing row
										const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id4);
										if (existing_row) {
											if (item_selected) {
												existing_row.charges = item_selected;
												existing_row.quantity = quantity;
												existing_row.cost = r.message.amount;
												frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
												frm.refresh_field('warehouse_charges');
													}
												}
											}
										}
						
						
									})
									}
								}
function updateWarehouseCharges5(frm, cdt, cdn) {
									const child = locals[cdt][cdn];
									const item_selected = child.service5;
									
									const quantity = child.qty5;
									const amount = child.amount5;
								
									if (item_selected && quantity && frm.doc.party_name){
								
									frappe.call({
										method: "a3trans.a3trans.events.opportunity.get_rate",
										args: {
											"itm": item_selected,
											"qty": quantity,
											"customer":frm.doc.party_name
								
										},
								
										callback: function(r) {
											console.log(r.message)
											child.rate5 = r.message.rate
											child.amount5 = r.message.amount
											frm.refresh_field("warehouse_stock_items")
											if (!child.id5) {
												// If labour_id is not set, add a new row
												const target_row = frm.add_child('warehouse_charges');
												target_row.charges = item_selected;
												target_row.quantity = quantity;
												target_row.cost = r.message.amount;
												child.id5 = target_row.idx;
												frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
												frm.refresh_field('warehouse_charges');
											} else {
												// If labour_id is already set, update the existing row
												const existing_row = frm.doc.warehouse_charges.find(row => row.idx === child.id5);
												if (existing_row) {
													if (item_selected) {
														existing_row.charges = item_selected;
														existing_row.quantity = quantity;
														existing_row.cost = r.message.amount;
														frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
														frm.refresh_field('warehouse_charges');
															}
														}
													}
												}
								
								
											})
											}
										}






frappe.ui.form.on('Warehouse Charges', {

	cost:function(frm, cdt, cdn) {
    	let aggregated_items = {}; // Object to store aggregated values.
   
    	// Loop through each row in warehouse charges
    	$.each(frm.doc.warehouse_charges || [], function(i, charge) {
        	if (charge.charges) {
            	if (aggregated_items[charge.charges]) {
                	// Aggregate if item already exists
                	aggregated_items[charge.charges].quantity += charge.quantity;
                	aggregated_items[charge.charges].amount += charge.cost;
            	} else {
                	// Or, create a new aggregated entry
                	aggregated_items[charge.charges] = {
                    	item: charge.charges,
                    	quantity: charge.quantity,
                    	amount: charge.cost,
                    	warehouse_charge_ref: charge.name
                	};
            	}
        	}
    	});
    	$.each(frm.doc.transit_charges || [], function(i, charge) {
        	if (charge.charges) {
            	if (aggregated_items[charge.charges]) {
                	// Aggregate if item already exists
                	aggregated_items[charge.charges].quantity += charge.quantity;
                	aggregated_items[charge.charges].amount += charge.cost;
            	} else {
                	// Or, create a new aggregated entry
                	aggregated_items[charge.charges] = {
                    	item: charge.charges,
                    	quantity: charge.quantity,
                    	amount: charge.cost,
                    	warehouse_charge_ref: charge.name
                	};
            	}
        	}
    	});
   
    	// Clear the existing opportunity_line_item table
    	frm.doc.opportunity_line_item = [];
   
    	// Populate the opportunity_line_item table with aggregated values
    	for (let item in aggregated_items) {
        	let target_row = frm.add_child('opportunity_line_item');
        	target_row.item = aggregated_items[item].item;
        	target_row.quantity = aggregated_items[item].quantity;
        	target_row.amount = aggregated_items[item].amount;
        	target_row.average_rate = target_row.amount / target_row.quantity;
        	target_row.warehouse_charge_ref = aggregated_items[item].warehouse_charge_ref;
   
        	frm.script_manager.trigger('amount', target_row.doctype, target_row.name);
    	}
   
    	frm.refresh_field('opportunity_line_item');
	},
   
	// You can now use this function on triggers related to warehouse charges addition/editing.
   
    	warehouse_charges_remove: function(frm, cdt, cdn) {
        	const groupedData = {};
    
    
        	// Group by items in warehouse_charges
        	$.each(frm.doc.warehouse_charges, function(_, charge) {
            	if (charge.charges) {
                	if (!groupedData[charge.charges]) {
                    	groupedData[charge.charges] = {
                        	quantity: 0,
                        	amount: 0,
                        	average_rate: 0,
                        	warehouse_charge_refs: []
                    	};
                	}
    
    
                	groupedData[charge.charges].quantity += charge.quantity;
                	groupedData[charge.charges].amount += charge.cost;
                	groupedData[charge.charges].warehouse_charge_refs.push(charge.name);
            	}
        	});
        	$.each(frm.doc.transit_charges, function(_, charge) {
            	if (charge.charges) {
                	if (!groupedData[charge.charges]) {
                    	groupedData[charge.charges] = {
                        	quantity: 0,
                        	amount: 0,
                        	average_rate: 0,
                        	warehouse_charge_refs: []
                    	};
                	}
    
    
                	groupedData[charge.charges].quantity += charge.quantity;
                	groupedData[charge.charges].amount += charge.cost;
                	groupedData[charge.charges].warehouse_charge_refs.push(charge.name);
            	}
        	});
    
    
        	// Update or Add rows in opportunity_line_item
        	for (let item in groupedData) {
            	const existing_row = frm.doc.opportunity_line_item.find(row => row.item && row.item === item);
    
    
            	if (existing_row) {
                	existing_row.quantity = groupedData[item].quantity;
                	existing_row.amount = groupedData[item].amount;
                	existing_row.average_rate = existing_row.amount / existing_row.quantity;
                	frm.script_manager.trigger('amount',existing_row.doctype, existing_row.name);
            	} else {
                	const target_row = frm.add_child('opportunity_line_item');
                	target_row.item = item;
                	target_row.quantity = groupedData[item].quantity;
                	target_row.amount = groupedData[item].amount;
                	target_row.average_rate = target_row.amount / target_row.quantity;
                	target_row.warehouse_charge_ref = JSON.stringify(groupedData[item].warehouse_charge_refs);
                	frm.script_manager.trigger('amount', target_row.doctype, target_row.name);
            	}
        	}
    
    
        	// Delete rows from opportunity_line_item that are not present in warehouse_charges
        	for (let i = frm.doc.opportunity_line_item.length - 1; i >= 0; i--) {
            	const row = frm.doc.opportunity_line_item[i];
            	if (!groupedData[row.item]) {
                	frm.get_field('opportunity_line_item').grid.grid_rows[i].remove();
            	}
        	}
    
    
        	frm.refresh_field('opportunity_line_item');
    	},
 
// kkkkkkkkkkkkkkkkkkkk
	charges: function(frm, cdt, cdn) {
   	 
    	var child = locals[cdt][cdn];
    	var char = child.charges;
    	console.log(child.charges,"ooooooooo");
    	if (child.idx){
        	console.log(child.idx,"mmmmmmmmmm");
        	const target_row = frm.add_child('warehouse_stock_items');
        	console.log(target_row,"pppppp")
        	if (child.idx === target_row.labour_id){
            	console.log("pppppp")
            	target_row.choose_labour_service=child.charges
            	frm.refresh_field("Warehouse_stock_items")
        	}
    	}
  	 

    	if (child.charges != "Warehouse Space Rent") {
        	frappe.model.set_value(cdt, cdn, 'quantity',1);
        	frm.refresh_field('quantity');
     	 
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.fetch_charges_price",
            	args: {
                	charges: char
            	},
            	callback: function(response) {
                	console.log(response.message);
                	frappe.model.set_value(cdt, cdn, 'cost',response.message["price_list_rate"]);
                	frm.refresh_field('cost');
					

              	 
               	 
            	}
        	});
    	}
	}
});

frappe.ui.form.on('Opportunity Line Items', {
	amount: function(frm,cdt,cdn) {
    	calculate_total_amount(frm);
	},

'opportunity_line_item_remove': function(frm) {
    	calculate_total_amount(frm);
	},
     	 
   	 
   	 
    
});
// A separate function to calculate the total_amount
function calculate_total_amount(frm) {
    var total_amount = 0;
    if (frm.doc.opportunity_line_item) {
        $.each(frm.doc.opportunity_line_item, function(index, row) {
            total_amount += row.amount;
        });

        frm.set_value('payment_amount', total_amount);
    } else {
        if(! frm.doc.opportunity_line_item){
			frm.set_value("payment_amount","")
		frm.refresh_field('payment_amount');
		}
   	 
    }

    frm.refresh_field('payment_amount'); // Refresh to show the updated value on the UI
}
frappe.ui.form.on('Shipment Details', {
    height: function (frm, cdt, cdn) {
        calculateVolume(frm, cdt, cdn);
    },

    length: function (frm, cdt, cdn) {
        calculateVolume(frm, cdt, cdn);
    },

    width: function (frm, cdt, cdn) {
        calculateVolume(frm, cdt, cdn);
    },

    type_uom: function (frm, cdt, cdn) {
        calculateVolume(frm, cdt, cdn);
    }
});

function calculateVolume(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var length = child.length || 0;
    var height = child.height || 0;
    var width = child.width || 0;
    var unit = child.type_uom // Default unit is centimeters

    // Convert length, height, and width to meters if the unit is in centimeters
    if (unit === 'Centimeter') {
        length = length / 100; // Convert centimeters to meters
        height = height / 100;
        width = width / 100;
    }

    var volume = length * height * width;
    child.volume = volume;
    frm.refresh_field('shipment_details');
}
