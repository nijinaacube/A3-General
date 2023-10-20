
var ind = 1;
frappe.ui.form.on('Lead', {
    onload :function(frm){
   
        if (frm.doc.transit_details_item){
            console.log(frm.doc.transit_details_item[frm.doc.transit_details_item.length - 1])
            ind = parseInt(frm.doc.transit_details_item[frm.doc.transit_details_item.length - 1].index ) + 1
        }
        if  (frm.is_new()){
             ind = 1
            frm.set_value('booking_date', frappe.datetime.get_today());
            var today = new Date();

            // Set the day to the last day of the current month
            today.setMonth(today.getMonth() + 1);  // Move to the next month
            today.setDate(0);  // Set to the last day of the previous month
    
            // Convert the date object to a string in 'yyyy-mm-dd' format
            var lastDayOfMonth = today.toISOString().split('T')[0];
    
            // Set the last day of the current month as the default value
            frm.set_value('booked_upto', lastDayOfMonth);
          

    }
},


    // refresh: function(frm) {
    //     if (!cur_frm.doc.__islocal && frm.doc.status === "Lead") {
    //         frm.add_custom_button(__('Convert'), function() {
                
                
    //             frappe.call({
    //                 method: 'a3trans.a3trans.events.lead.convert',
    //                 args: {
    //                     'doc': frm.doc.name
    //                 },
    //                 callback: function(r) {
    //                     if (r.message) {
    //                         console.log(r.message.name);
    //                         console.log(frm.doc.booking_type)

    //                         // Pre-fill fields in the Opportunity from the Lead
    //                         frappe.new_doc('Opportunity', {
    //                             "opportunity_from": "Customer",
    //                             "lead_id":frm.doc.name,
    //                             "customer_name":r.message.name, // Set party_name from the returned data
    //                             "party_name":r.message.name,
    //                             "booking_type": frm.doc.booking_type,
    //                             "order_status": "New",
    //                             "booking_channel": frm.doc.booking_channel
                              
    //                         });
    //                     }
    //                 }
    //             });
    //         }).addClass('btn-primary');
    //     }
    // },
    booking_type:function(frm){

        if(frm.doc.booking_type==="Warehousing"){
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

},
required_labour_service:function (frm){

    if (!frm.doc.labour_id) {
        // If labour_id is not set, add a new row
        const target_row = frm.add_child('warehouse_charges_item');
        target_row.charges = frm.doc.required_labour_service;
        target_row.quantity = 1;
        frm.doc.labour_id = target_row.idx;
        frm.refresh_field('warehouse_charges_item');
    } else {
        // If labour_id is already set, update the existing row
        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.labour_id);
        if (existing_row) {
            existing_row.charges = frm.doc.required_labour_service;
          
            frm.refresh_field('warehouse_charges_item');
        } 
    }

},
required_handling_services:function (frm){

    if (!frm.doc.handle_id) {
        // If labour_id is not set, add a new row
        const target_row = frm.add_child('warehouse_charges_item');
        target_row.charges = frm.doc.required_handling_services;
        target_row.quantity = 1;
        frm.doc.handle_id = target_row.idx;
        frm.refresh_field('warehouse_charges_item');
    } else {
        // If labour_id is already set, update the existing row
        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.handle_id);
        if (existing_row) {
            existing_row.charges = frm.doc.required_handling_services;
          
            frm.refresh_field('warehouse_charges_item');
        } 
    }

},
required_area:function(frm){
    if (frm.doc.warehouse){
        if (frm.doc.booked_upto && frm.doc.required_area){

            frappe.call({
                method: 'a3trans.a3trans.events.lead.calculate_rental_cost',
                args: {
                    'required_area':frm.doc.required_area ,
                    'booking_date': frm.doc.booking_date,
                    'booked_upto' : frm.doc.booked_upto,
                    'uom' : frm.doc.uom,
                    "cargo_type":frm.doc.cargo_type
                },
                callback: function(response) {
                    console.log(response.message);
                    frm.set_value("no_of_days",response.message["difference"])
                    frm.refresh_field("no_of_days")
                    if (!frm.doc.space_id){
                    const target_row = frm.add_child('warehouse_charges_item');
                    target_row.charges = "Warehouse Space Rent";
                    target_row.quantity = 1
                    frm.doc.space_id = target_row.idx
                    target_row.cost = response.message["total_amount"]
                    frm.refresh_field('warehouse_charges_item');
                    
                    }
                    else{
                        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.space_id);
                    if (existing_row) {
                        existing_row.charges = "Warehouse Space Rent";
                        existing_row.quantity = 1
                        existing_row.cost = response.message["total_amount"]
                    
                        frm.refresh_field('warehouse_charges_item');
                    }  
                    }
                }

            })
        }
    }
    else{
        frappe.throw("Please choose a Warehouse")
    }


},
warehouse:function(frm){
    if (frm.doc.required_area){
        if (frm.doc.booked_upto && frm.doc.required_area){

            frappe.call({
                method: 'a3trans.a3trans.events.lead.calculate_rental_cost',
                args: {
                    'required_area':frm.doc.required_area ,
                    'booking_date': frm.doc.booking_date,
                    'booked_upto' : frm.doc.booked_upto,
                    'uom' : frm.doc.uom,
                    "cargo_type":frm.doc.cargo_type
                },
                callback: function(response) {
                    console.log(response.message);
                    frm.set_value("no_of_days",response.message["difference"])
                    frm.refresh_field("no_of_days")
                    if (!frm.doc.space_id){
                    const target_row = frm.add_child('warehouse_charges_item');
                    target_row.charges = "Warehouse Space Rent";
                    target_row.quantity = 1
                    frm.doc.space_id = target_row.idx
                    target_row.cost = response.message["total_amount"]
                    frm.refresh_field('warehouse_charges_item');
                    
                    }
                    else{
                        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.space_id);
                    if (existing_row) {
                        existing_row.charges = "Warehouse Space Rent";
                        existing_row.quantity = 1
                        existing_row.cost = response.message["total_amount"]
                    
                        frm.refresh_field('warehouse_charges_item');
                    }  
                    }

                }

            })
        }
    }
   

}

});
frappe.ui.form.on('Transit Details Item', {
    zone: function(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        if (!row.index){
            row.index = ind;
            ind += 1;
        }
        frm.refresh_field("transit_details_item");
        const transit_details = frm.doc.transit_details_item;

        if (frm.doc.vehicle_type) {
            if (transit_details.length > 1) {
                const from_row = transit_details[transit_details.length - 2];
                const to_row = transit_details[transit_details.length - 1];

                // Calculate transportation cost between the current and previous zones
                frappe.call({
                    method: 'a3trans.a3trans.events.lead.calculate_transportation_cost',
                    args: {
                        'zone': JSON.stringify([from_row.zone, to_row.zone]),
                        'vehicle_type': frm.doc.vehicle_type,
                    },
                    callback: function(response) {
                        console.log(response.message);
                        const cost = response.message;

                        // Update or create 'transit_charges_item' child table rows
                        const transit_charges = frm.doc.transit_charges_item || [];
                        let updated = false;

                        for (let i = 0; i < transit_charges.length; i++) {
                            const charge = transit_charges[i];
                            if (charge.from_id === row.index) {
                                console.log("success",cost);
                                // Update the existing transportation charge row
                                charge.cost = cost;
                                console.log(charge.description.split("to"),"$$$$$$$$$$$$$4")
                                var fromcity = charge.description.split(" to ")
                                charge.description = row.zone + ' to ' + fromcity[1]; // Updated description
                                frm.refresh_field('transit_charges_item');
                            
                                updated = true;
                             
                            }
                            if (charge.to_id === row.index) {
                                console.log(charge.description.split("to"),"$$$$$$$$$$$$$4")
                                console.log("success",cost);
                                // Update the existing transportation charge row
                                charge.cost = cost;
                                var fromcity = charge.description.split(" to ")
                                charge.description = fromcity[0] + ' to ' + row.zone 
                                frm.refresh_field('transit_charges_item');
                                updated = true;
                                
                            }
                        }

                        if (!updated) {
                            // Create a new 'transit_charges_item' child table row
                            const transit_charges_row = frm.add_child('transit_charges_item');
                            transit_charges_row.charges = 'Transportation Charges';
                            transit_charges_row.quantity = 1;
                            transit_charges_row.description = from_row.zone + ' to ' + row.zone; // Updated description
                            transit_charges_row.cost = cost;
                            transit_charges_row.from_id = from_row.index;
                            transit_charges_row.to_id = row.index;
                            frm.refresh_field('transit_charges_item');
                        }
                    }
                });
            }
        }
        else{
            frappe.throw("Please choose vehicle Type")
        }
    }
});
