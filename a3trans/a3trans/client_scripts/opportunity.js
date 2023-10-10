frappe.ui.form.on('Opportunity', {
    
	refresh: function(frm) {
   	 
    	// if (frm.doc.booking_type!="Warehouse"){
    	// frm.fields_dict['links'].toggle(false);
    	// }
 
    	if  (frm.is_new()){
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
    	}
	}
    
});


frappe.ui.form.on('Opportunity', {

    
	party_name: function(frm) {
   	 
    	if (frm.doc.party_name){
        	if (frm.doc.booking_type=="Warehouse"){
      	 
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
   	 
    	if (frm.doc.booking_type=="Vehicle"){
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
                	// const transit_row=frm.add_child('transit_charges')
                	// transit_row.charges="Transportation Charges"
                	// frm.script_manager.trigger('charges', transit_row.doctype, transit_row.name);
                	// frm.refresh_field('transit_charges');
                  	 
                	 
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
                        	if (frm.doc.booking_type=="Warehouse"){
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
   	 
    	if (frm.doc.booking_type=="Vehicle"){
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
       	 


    	}
    	frm.fields_dict['opportunity_line_item'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
          	 
        	return {
            	filters: {
                	"is_stock_item": 0
            	}
        	};
    	};
    

    	if (frm.doc.booking_type == "Warehouse") {
        	frm.fields_dict['warehouse_stock_items'].grid.get_field('choose_labour_service').get_query = function(doc, cdt, cdn) {
          	 
            	return {
                	filters: {
                    	"item_group": ["in", "Labour Charges"]
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
    	// Check if the form or receiver_information is not available
    	if (!frm.doc || !frm.doc.receiver_information) return;
   	 
    	// Extract the 'zone' values from 'receiver_information'
    	const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
   	 
    	// Handle deletion of transit charges
    	if (frm._deleted_zone) {
        	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
        	if (charge_to_remove) {
            	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
        	}
        	delete frm._deleted_zone;  // Clean up the temporary variable
        	frm.refresh_field('transit_charges');
        	return;  // Early exit after handling deletion
    	}

    	// Initialize transit_charges if it's not present
    	if (!frm.doc.transit_charges) {
        	frm.doc.transit_charges = [];
    	}

    	if (zones.length == 2) {
        	// Calculate cost and add transportation charge
        	let from_zone = zones[0];
        	let to_zone = zones[1];
       	 
        	if (frm.doc.vehicle_type) {
            	frappe.call({
                	method: "a3trans.a3trans.events.opportunity.calculate_transportation_cost",
                	args: {
                    	"customer": frm.doc.party_name,
                    	"zone": JSON.stringify([from_zone, to_zone]),
                    	"vehicle_type": frm.doc.vehicle_type,
                    	"length": frm.doc.receiver_information.length
                	},
                	callback: function(response) {
                    	if (response.message) {
                        	let existing_row = frm.doc.transit_charges.find(r => r.from_zone == from_zone && r.to_zone == to_zone);
                       	 
                        	if (!existing_row) {
                            	const target_row = frm.add_child('transit_charges');
                            	target_row.charges = "Transportation Charges";
                            	target_row.quantity = 1;
                            	target_row.cost = response.message;
                            	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                            	frm.refresh_field('transit_charges');
                        	}
                    	}
                    	else{
            	const target_row = frm.add_child('transit_charges');
            	target_row.charges = "Transportation Charges";
            	target_row.quantity = 1;
            	target_row.cost = 0;
            	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
            	frm.refresh_field('transit_charges');
                    	}
                	}
            	});
        	}
    	}

    	

    	if (frm._deleted_zone) {
        	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
        	if (charge_to_remove) {
            	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
        	}
        	delete frm._deleted_zone;  // Clean up the temporary variable
    	}

    	// Filter transit_charges based on valid zone pairs
    	const validZonePairs = [];
    	for (let i = 0; i < zones.length - 1; i++) {
        	validZonePairs.push({ from_zone: zones[i], to_zone: zones[i + 1] });
    	}
    	frm.doc.transit_charges = frm.doc.transit_charges.filter(charge => {
        	return validZonePairs.some(pair => pair.from_zone == charge.from_zone && pair.to_zone == charge.to_zone);
    	});
    	// frm.refresh_field('transit_charges');
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



frappe.ui.form.on('Transit Details', {

   
    

	choose_required_labour_service: function(frm, cdt, cdn) {
    	var child1 = locals[cdt][cdn];
    	var item_selected = child1.choose_required_labour_service;

    	if (!child1.labour_id) {
        	// If labour_id is not set, add a new row
        	const target_row = frm.add_child('transit_charges');
        	target_row.charges = item_selected;
        	target_row.quantity = 1;
        	child1.labour_id = target_row.idx;
        	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        	frm.refresh_field('transit_charges');
    	} else {
        	// If labour_id is already set, update the existing row
        	var existing_row = frm.doc.transit_charges.find(row => row.idx === child1.labour_id);
        	if (existing_row) {
            	existing_row.charges = item_selected;
            	frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
            	frm.refresh_field('transit_charges');
        	} else {
            	// Handle the case where the existing row with labour_id is not found
            	frappe.msgprint('Row not found with labour_id: ' + child1.labour_id);
        	}
    	}
	},
	choose_required_handling_service: function(frm, cdt, cdn) {
    	var child1 = locals[cdt][cdn];
    	var item_selected = child1.choose_required_handling_service;

    	if (!child1.handle_id) {
        	// If labour_id is not set, add a new row
        	const target_row = frm.add_child('transit_charges');
        	target_row.charges = item_selected;
        	target_row.quantity = 1;
        	child1.handle_id = target_row.idx;
        	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        	frm.refresh_field('transit_charges');
    	} else {
        	// If labour_id is already set, update the existing row
        	var existing_row = frm.doc.transit_charges.find(row => row.idx === child1.handle_id);
        	if (existing_row) {
            	existing_row.charges = item_selected;
            	frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
            	frm.refresh_field('transit_charges');
        	} else {
            	// Handle the case where the existing row with labour_id is not found
            	frappe.msgprint('Row not found with labour_id: ' + child1.labour_id);
        	}
    	}
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
	
	if (!frm.doc || !frm.doc.receiver_information) return;
	const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
	frm.set_value("table_length",zones.length)

	// Handle deletion
	if (frm._deleted_zone) {
    	console.log("Handling removal for zone:", frm._deleted_zone);
    	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
    	if (charge_to_remove) {
        	console.log("Found associated charge to remove:", charge_to_remove);
        	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
    	}
    	delete frm._deleted_zone;  // Clean up the temporary variable
    	frm.refresh_field('transit_charges');
    	return;  // Early exit after handling deletion
	}

	// Initialize transit_charges if it's not present
	if (!frm.doc.transit_charges) {
    	frm.doc.transit_charges = [];
	}

	if (zones.length == 2) {
    	// Calculate cost and add transportation charge
    	let from_zone = zones[0];
    	let to_zone = zones[1];
    	if (frm.doc.vehicle_type) {
      	 
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.calculate_transportation_cost",
            	args: {
                	"customer": frm.doc.party_name,
                	"zone": JSON.stringify([from_zone, to_zone]),
                	"vehicle_type": frm.doc.vehicle_type,
                	"length": frm.doc.receiver_information.length
            	},
            	callback: function(response) {
                	
                	if (response.message) {
                    	let existing_row = frm.doc.transit_charges.find(r => r.from_zone == from_zone && r.to_zone == to_zone);
                        	
                    	if (!existing_row) {
							console.log(response.message)
                        	const target_row = frm.add_child('transit_charges');
                        	target_row.charges = "Transportation Charges";
                        	target_row.quantity = 1;
                        	target_row.from_zone = from_zone;
                        	target_row.to_zone = to_zone;
                        	target_row.cost = response.message;
                        	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                        	frm.refresh_field('transit_charges');
                    	}
                	}
                	else{
                    	const target_row = frm.add_child('transit_charges');
                    	target_row.charges = "Transportation Charges";
                    	target_row.quantity = 1;
                    	target_row.cost = 0;
                    	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                    	frm.refresh_field('transit_charges');
                            	}
            	}
        	});
    	}
	}



	if (frm._deleted_zone) {
    	console.log("Handling removal for zone:", frm._deleted_zone);
    	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
    	if (charge_to_remove) {
        	console.log("Found associated charge to remove:", charge_to_remove);
        	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
    	}
    	delete frm._deleted_zone;  // Clean up the temporary variable
	}

	const validZonePairs = [];
	for (let i = 0; i < zones.length - 1; i++) {
    	validZonePairs.push({ from_zone: zones[i], to_zone: zones[i + 1] });
	}
	frm.doc.transit_charges = frm.doc.transit_charges.filter(charge => {
    	return validZonePairs.some(pair => pair.from_zone == charge.from_zone && pair.to_zone == charge.to_zone);
	});
	frm.refresh_field('transit_charges');
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
    	 
    	console.log(child, "jjjjjjjjjjjjjjjjjjjjjjj");
    	update_order_no(frm);
	 
   	 
	},
})






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

	if (!frm.doc || !frm.doc.receiver_information) return;
	const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
	frm.set_value("table_length",zones.length)

	// Handle deletion
	if (frm._deleted_zone) {
    	console.log("Handling removal for zone:", frm._deleted_zone);
    	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
    	if (charge_to_remove) {
        	console.log("Found associated charge to remove:", charge_to_remove);
        	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
    	}
    	delete frm._deleted_zone;  // Clean up the temporary variable
    	frm.refresh_field('transit_charges');
    	return;  // Early exit after handling deletion
	}

	// Initialize transit_charges if it's not present
	if (!frm.doc.transit_charges) {
    	frm.doc.transit_charges = [];
	}

	
	if (zones.length >= 3) {
    	let from_zone = frm.doc.from_location;
    	let to_zone = frm.doc.to_location;
    	if (frm.doc.vehicle_type) {
      	 
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.calculate_transportation_cost",
            	args: {
                	"customer": frm.doc.party_name,
                	"zone": JSON.stringify([from_zone, to_zone]),
                	"vehicle_type": frm.doc.vehicle_type,
                	"length": frm.doc.receiver_information.length
            	},
            	callback: function(response) {
                	
                	if (response.message) {
                    	let existing_row = frm.doc.transit_charges.find(r => r.from_zone == from_zone && r.to_zone == to_zone);
                        	
                    	if (!existing_row) {
							console.log(response.message)
                        	const target_row = frm.add_child('transit_charges');
                        	target_row.charges = "Transportation Charges";
                        	target_row.quantity = 1;
                        	target_row.from_zone = from_zone;
                        	target_row.to_zone = to_zone;
                        	target_row.cost = response.message;
                        	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                        	frm.refresh_field('transit_charges');
                    	}
                	}
                	else{
                    	const target_row = frm.add_child('transit_charges');
                    	target_row.charges = "Transportation Charges";
                    	target_row.quantity = 1;
                    	target_row.cost = 0;
                    	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                    	frm.refresh_field('transit_charges');
                            	}
            	}
        	});
    	}
	}

	if (frm._deleted_zone) {
    	console.log("Handling removal for zone:", frm._deleted_zone);
    	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
    	if (charge_to_remove) {
        	console.log("Found associated charge to remove:", charge_to_remove);
        	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
    	}
    	delete frm._deleted_zone;  // Clean up the temporary variable
	}

	const validZonePairs = [];
	for (let i = 0; i < zones.length - 1; i++) {
    	validZonePairs.push({ from_zone: zones[i], to_zone: zones[i + 1] });
	}
	frm.doc.transit_charges = frm.doc.transit_charges.filter(charge => {
    	return validZonePairs.some(pair => pair.from_zone == charge.from_zone && pair.to_zone == charge.to_zone);
	});
	frm.refresh_field('transit_charges');



},
to_location:function(frm){
	if (!frm.doc || !frm.doc.receiver_information) return;
	const zones = frm.doc.receiver_information.map(receiver => receiver.zone);
	frm.set_value("table_length",zones.length)

	// Handle deletion
	if (frm._deleted_zone) {
    	console.log("Handling removal for zone:", frm._deleted_zone);
    	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
    	if (charge_to_remove) {
        	console.log("Found associated charge to remove:", charge_to_remove);
        	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
    	}
    	delete frm._deleted_zone;  // Clean up the temporary variable
    	frm.refresh_field('transit_charges');
    	return;  // Early exit after handling deletion
	}

	// Initialize transit_charges if it's not present
	if (!frm.doc.transit_charges) {
    	frm.doc.transit_charges = [];
	}

	
	if (zones.length >= 3) {
    	let from_zone = frm.doc.from_location;
    	let to_zone = frm.doc.to_location;
    	if (frm.doc.vehicle_type) {
      	 
        	frappe.call({
            	method: "a3trans.a3trans.events.opportunity.calculate_transportation_cost",
            	args: {
                	"customer": frm.doc.party_name,
                	"zone": JSON.stringify([from_zone, to_zone]),
                	"vehicle_type": frm.doc.vehicle_type,
                	"length": frm.doc.receiver_information.length
            	},
            	callback: function(response) {
                	
                	if (response.message) {
                    	let existing_row = frm.doc.transit_charges.find(r => r.from_zone == from_zone && r.to_zone == to_zone);
                        	
                    	if (!existing_row) {
							console.log(response.message)
                        	const target_row = frm.add_child('transit_charges');
                        	target_row.charges = "Transportation Charges";
                        	target_row.quantity = 1;
                        	target_row.from_zone = from_zone;
                        	target_row.to_zone = to_zone;
                        	target_row.cost = response.message;
                        	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                        	frm.refresh_field('transit_charges');
                    	}
                	}
                	else{
                    	const target_row = frm.add_child('transit_charges');
                    	target_row.charges = "Transportation Charges";
                    	target_row.quantity = 1;
                    	target_row.cost = 0;
                    	frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                    	frm.refresh_field('transit_charges');
                            	}
            	}
        	});
    	}
	}

	if (frm._deleted_zone) {
    	console.log("Handling removal for zone:", frm._deleted_zone);
    	const charge_to_remove = frm.doc.transit_charges.find(r => r.from_zone == frm._deleted_zone || r.to_zone == frm._deleted_zone);
    	if (charge_to_remove) {
        	console.log("Found associated charge to remove:", charge_to_remove);
        	frm.get_field('transit_charges').grid.grid_rows_by_docname[charge_to_remove.name].remove();
    	}
    	delete frm._deleted_zone;  // Clean up the temporary variable
	}

	const validZonePairs = [];
	for (let i = 0; i < zones.length - 1; i++) {
    	validZonePairs.push({ from_zone: zones[i], to_zone: zones[i + 1] });
	}
	frm.doc.transit_charges = frm.doc.transit_charges.filter(charge => {
    	return validZonePairs.some(pair => pair.from_zone == charge.from_zone && pair.to_zone == charge.to_zone);
	});
	frm.refresh_field('transit_charges');





},
 
customer_name:function(frm){
   
	if (frm.doc.customer_name && frm.doc.party_name==""){
    	frm.set_value("party_name",frm.doc.customer_name)
    	frm.refresh_field("party_name")
	}

},


onload: function(frm) {
	if (frm.doc.lead_id) {
    	console.log(frm.doc.lead_id, );

    	frappe.call({
        	method: "a3trans.a3trans.events.lead.get_location",
        	args: {
            	"doc": frm.doc.lead_id
        	},
        	callback: function(r) {
            	console.log(r.message["to"]);
            	if (r.message && frm.doc.booking_type === "Vehicle") {
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
    	});
	}


   	 
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



 	 

       	 
                	frm.fields_dict['receiver_information'].grid.get_field('choose_required_labour_service').get_query = function(doc, cdt, cdn) {
                  	 
                    	return {
                        	filters: {
                            	"item_group": ["in", "Labour Charges"]
                        	}
                    	};
                	};
           	 
   	 
                	frm.fields_dict['receiver_information'].grid.get_field('choose_required_handling_service').get_query = function(doc, cdt, cdn) {
                  	 
                    	return {
                        	filters: {
                            	"item_group": ["in", "Handling Charges"]
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
    	// }
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
            	console.log(aggregated_items,"ppp")
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
                    	frappe.model.set_value(cdt, cdn, 'cost', response.message["price_list_rate"]);
                    	frappe.model.set_value(cdt, cdn, 'quantity', 1);
                	}
            	}
        	});
    	}
	}
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
	choose_labour_service: function(frm, cdt, cdn) {
    	var child1 = locals[cdt][cdn];
    	var item_selected = child1.choose_labour_service;

    	if (!child1.labour_id) {
        	// If labour_id is not set, add a new row
        	const target_row = frm.add_child('warehouse_charges');
        	target_row.charges = item_selected;
        	target_row.quantity = 1;
        	child1.labour_id = target_row.idx;
        	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        	frm.refresh_field('warehouse_charges');
    	} else {
        	// If labour_id is already set, update the existing row
        	var existing_row = frm.doc.warehouse_charges.find(row => row.idx === child1.labour_id);
        	if (existing_row) {
            	existing_row.charges = item_selected;
            	frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
            	frm.refresh_field('warehouse_charges');
        	} else {
            	// Handle the case where the existing row with labour_id is not found
            	frappe.msgprint('Row not found with labour_id: ' + child1.labour_id);
        	}
    	}
	},
	choose_handling_service: function(frm, cdt, cdn) {
    	var child1 = locals[cdt][cdn];
    	var item_selected = child1.choose_handling_service;

    	if (!child1.handle_id) {
        	// If labour_id is not set, add a new row
        	const target_row = frm.add_child('warehouse_charges');
        	target_row.charges = item_selected;
        	target_row.quantity = 1;
        	child1.handle_id = target_row.idx;
        	frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        	frm.refresh_field('warehouse_charges');
    	} else {
        	// If labour_id is already set, update the existing row
        	var existing_row = frm.doc.warehouse_charges.find(row => row.idx === child1.handle_id);
        	if (existing_row) {
            	existing_row.charges = item_selected;
            	frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
            	frm.refresh_field('warehouse_charges');
        	} else {
            	// Handle the case where the existing row with labour_id is not found
            	frappe.msgprint('Row not found with labour_id: ' + child1.labour_id);
        	}
    	}
	},

    
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
	$.each(frm.doc.opportunity_line_item || [], function(index, row) {
    	total_amount += row.amount;
	});

	frm.set_value('payment_amount', total_amount);
	frm.refresh_field('payment_amount');  // Refresh to show the updated value on the UI
}
