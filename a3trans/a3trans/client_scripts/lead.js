
var ind = 1;

frappe.ui.form.on('Lead', {
    onload :function(frm){


        
       
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
        if(frm.doc.booking_type==="Transport"){ 
            frm.fields_dict['shipment_details'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
          	 
                return {
                    filters: {
                        "is_stock_item": 1
                    }
                };
            };
      
        if (frm.doc.transit_details_item){
            console.log(frm.doc.transit_details_item[frm.doc.transit_details_item.length - 1])
            ind = parseInt(frm.doc.transit_details_item[frm.doc.transit_details_item.length - 1].index ) + 1
        }
        

    frm.fields_dict['transit_details_item'].grid.get_field('choose_required_labour_service').get_query = function(doc, cdt, cdn) {
          	 
        return {
            filters: {
                "item_group": "Labour Charges"
            }
        };
    };
    frm.fields_dict['transit_details_item'].grid.get_field('choose_required_handling_service').get_query = function(doc, cdt, cdn) {
           
        return {
            filters: {
                "item_group": "Handling Charges"
            }
        };
    };
    frm.fields_dict['transit_details_item'].grid.get_field('choose_required_loading_service').get_query = function(doc, cdt, cdn) {
           
        return {
            filters: {
                "item_group": "Loading Charges"
            }
        };
    };
    frm.fields_dict['transit_charges_item'].grid.get_field('charges').get_query = function(doc, cdt, cdn) {
           
        return {
            filters: {
                "is_stock_item": 0,
                "item_group":"Services"
            }
        };
    };

}

frm.fields_dict['transit_charges_item'].grid.get_field('vehicle_type').get_query = function(doc, cdt, cdn) {
    var child = locals[cdt][cdn];
    var filters = {
    
        'name': ['in', frm.doc.vehicle_list.map(row => row.vehicle_type)]
    };
    return {
        filters: filters
    };
};

if(frm.doc.booking_type==="Warehousing"){

    frm.fields_dict['warehouse'].get_query = function(doc){
        return {
            filters: {
                'is_group': 1
            }
        };
    

    }
    frm.fields_dict['required_labour_service'].get_query = function(doc){
        return {
            filters: {
                'item_group': "Labour Charges"
            }
        };
    

    }
    frm.fields_dict['required_handling_services'].get_query = function(doc){
        return {
            filters: {
                'item_group': "Handling Charges"
            }
        };
    

    }
    frm.fields_dict['required_loading_service'].get_query = function(doc){
        return {
            filters: {
                'item_group': "Loading Charges"
            }
        };
    

    }
    frm.fields_dict['warehouse_charges_item'].grid.get_field('charges').get_query = function(doc, cdt, cdn) {
   
        return {
            filters: {
                "is_stock_item": 0
            }
        };
    };
}

},


 refresh: function(frm) {


            frm.fields_dict['contact_by'].get_query = function(doc){
                return {
                    filters: {
                        'role_profile_name': ["not in",["Logistic Customer","Driver"]]
                    }
                };


            }
    
    setTimeout(() => {
        $(".form-links").hide(); // Corrected selector with double quotes
    }, 10);
    // frm.fields_dict.custom_button.$wrapper.hide();
   
    // frm.set_df_property('opportunity', 'hidden', 1);
        // frm.get_field('').$wrapper.hide();
    
    
        frm.fields_dict['additional_services'].grid.get_field('additional_service').get_query = function(doc, cdt, cdn) {
          	 
            return {
                filters: {
                    "item_group": "Additional Services"
                }
            };
        };

    frm.fields_dict['add_select_tariff'].get_query = function(doc){
        return {
            filters: {
                'is_standard': 1,
               
            }
        };
    

    }
 },
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


    frm.fields_dict['additional_services'].grid.get_field('additional_service').get_query = function(doc, cdt, cdn) {
          	 
        return {
            filters: {
                "item_group": "Additional Services"
            }
        };
    };
    if(frm.doc.booking_type==="Transport"){

        frm.fields_dict['transit_details_item'].grid.get_field('choose_required_labour_service').get_query = function(doc, cdt, cdn) {
          	 
            return {
                filters: {
                    "item_group": "Labour Charges"
                }
            };
        };
        frm.fields_dict['transit_details_item'].grid.get_field('choose_required_handling_service').get_query = function(doc, cdt, cdn) {
          	 
            return {
                filters: {
                    "item_group": "Handling Charges"
                }
            };
        };
        frm.fields_dict['transit_details_item'].grid.get_field('choose_required_loading_service').get_query = function(doc, cdt, cdn) {
          	 
            return {
                filters: {
                    "item_group": "Loading Charges"
                }
            };
        };
        frm.fields_dict['transit_charges_item'].grid.get_field('charges').get_query = function(doc, cdt, cdn) {
          	 
            return {
                filters: {
                    "is_stock_item": 0,
                    "item_group":"Services"
                }
            };
        };
        frm.fields_dict['shipment_details'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
          	 
            return {
                filters: {
                    "is_stock_item": 1
                }
            };
        };


    }

        if(frm.doc.booking_type==="Warehousing"){
           
            frm.fields_dict['shipment_details'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
          	 
                return {
                    filters: {
                        "is_stock_item": 1
                    }
                };
            };
       
            frm.fields_dict['warehouse'].get_query = function(doc){
                    return {
                        filters: {
                            'is_group': 1
                        }
                    };
                

                }
                frm.fields_dict['required_labour_service'].get_query = function(doc){
                    return {
                        filters: {
                            'item_group': "Labour Charges"
                        }
                    };
                

                }
                frm.fields_dict['required_handling_services'].get_query = function(doc){
                    return {
                        filters: {
                            'item_group': "Handling Charges"
                        }
                    };
                

                }
                frm.fields_dict['required_loading_service'].get_query = function(doc){
                    return {
                        filters: {
                            'item_group': "Loading Charges"
                        }
                    };
                

                }
                frm.fields_dict['warehouse_charges_item'].grid.get_field('charges').get_query = function(doc, cdt, cdn) {
          	 
                    return {
                        filters: {
                            "is_stock_item": 0
                        }
                    };
                };

                
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
required_loading_service:function (frm){

    if (!frm.doc.load_id) {
        // If labour_id is not set, add a new row
        const target_row = frm.add_child('warehouse_charges_item');
        target_row.charges = frm.doc.required_loading_service;
        target_row.quantity = 1;
        // target_row.description = "Labour Charges"
        frm.doc.load_id = target_row.idx;
        frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        frm.refresh_field('warehouse_charges_item');
    } else {
        // If labour_id is already set, update the existing row
        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.load_id);
        if (existing_row) {
            existing_row.charges = frm.doc.required_loading_service;
            frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
          
            frm.refresh_field('warehouse_charges_item');
        } 
    }

},
required_labour_service:function (frm){

    if (!frm.doc.labour_id) {
        // If labour_id is not set, add a new row
        const target_row = frm.add_child('warehouse_charges_item');
        target_row.charges = frm.doc.required_labour_service;
        target_row.quantity = 1;
        // target_row.description = "Labour Charges"
        frm.doc.labour_id = target_row.idx;
        frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        frm.refresh_field('warehouse_charges_item');
    } else {
        // If labour_id is already set, update the existing row
        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.labour_id);
        if (existing_row) {
            existing_row.charges = frm.doc.required_labour_service;
            frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
          
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
        // target_row.description = "Handling Charges"
        frm.doc.handle_id = target_row.idx;
        frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        frm.refresh_field('warehouse_charges_item');
    } else {
        // If labour_id is already set, update the existing row
        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.handle_id);
        if (existing_row) {
            existing_row.charges = frm.doc.required_handling_services;
            frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
          
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
                    "cargo_type":frm.doc.cargo_type,
                    "booking_type":frm.doc.booking_type
                },
                callback: function(response) {
                    console.log(response.message);
                    frm.set_value("no_of_days",response.message["difference"])
                    frm.refresh_field("no_of_days")
                    if (!frm.doc.space_id){
                    const target_row = frm.add_child('warehouse_charges_item');
                    target_row.charges = response.message.bill_item;
                    target_row.quantity = 1
                    frm.doc.space_id = target_row.idx
                    target_row.cost = response.message["total_amount"]
                    frm.refresh_field('warehouse_charges_item');
                    
                    }
                    else{
                        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.space_id);
                    if (existing_row) {
                        existing_row.charges = response.message.bill_item;
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
                    "cargo_type":frm.doc.cargo_type,
                    "booking_type":frm.doc.booking_type
                },
                callback: function(response) {
                    console.log(response.message);
                    frm.set_value("no_of_days",response.message["difference"])
                    frm.refresh_field("no_of_days")
                    if (!frm.doc.space_id){
                    const target_row = frm.add_child('warehouse_charges_item');
                    target_row.charges = response.message.bill_item;
                    target_row.quantity = 1
                    frm.doc.space_id = target_row.idx
                    target_row.cost = response.message["total_amount"]
                    frm.refresh_field('warehouse_charges_item');
                    
                    }
                    else{
                        var existing_row = frm.doc.warehouse_charges_item.find(row => row.idx ===  frm.doc.space_id);
                    if (existing_row) {
                        existing_row.charges = response.message.bill_item;
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
frappe.ui.form.on('Additional Services',{
    additional_service:function(frm,cdt,cdn){
        

        const row = locals[cdt][cdn];
        let tariff = ""
        if (frm.doc.add_select_tariff){
            tariff = frm.doc.add_select_tariff
        }
        else{
            tariff = "NIL"
        }
        if (row.additional_service){
            if(row.quantity){
            frappe.call({
                method: 'a3trans.a3trans.events.lead.service_charge',
                args:{

                    "service" : row.additional_service,
                    "qty"   : row.quantity,
                    "tariff_doc":tariff
                   

                },
                callback:function(r){
                    console.log(r.message)
                    row.rate = r.message.rate
                    row.amount = r.message.amount
                    frm.refresh_field("additional_services")

                }
            })
        }
   
    }
    else{
        frappe.throw("Please select required service")
    }
       
    },
quantity : function(frm,cdt,cdn){
   

        const row = locals[cdt][cdn];
        let tariff = ""
        if (frm.doc.add_select_tariff){
            tariff = frm.doc.add_select_tariff
        }
        else{
            tariff = "NIL"
        }
        if (row.additional_service){
            if(row.quantity){
            frappe.call({
                method: 'a3trans.a3trans.events.lead.service_charge',
                args:{

                    "service" : row.additional_service,
                    "qty"   : row.quantity,
                    "tariff_doc":tariff
                   

                },
                callback:function(r){
                    console.log(r.message)
                    row.rate = r.message.rate
                    row.amount = r.message.amount
                    frm.refresh_field("additional_services")

                }
            })
        }
        else{
            frappe.throw("Please be sure you have entered quantity")
        }
    }
    else{
        frappe.throw("Please select required service")
    }
       
    },
    rate: function(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        
        if (row.additional_service && row.quantity) {
            if (row.rate) {
                row.amount = flt(row.quantity) * flt(row.rate);
                frm.refresh_field("additional_services");
            } else {
                frappe.throw("Please enter a rate for the service.");
            }
        } else if (!row.quantity) {
            frappe.throw("Please enter the quantity.");
        } else {
            frappe.throw("Please select the required service.");
        }
    }

})


frappe.ui.form.on('Transit Details Item', {
    zone: function(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        if (!row.index){
            row.index = ind;
            ind += 1;
        }
        frm.refresh_field("transit_details_item");
        const transit_details = frm.doc.transit_details_item;
        let tariff = ""
        if (frm.doc.add_select_tariff){
            tariff = frm.doc.add_select_tariff
        }
        else{
            tariff ="NIL"
        }
        console.log("Arguments for API call:", {
            
            'booking_type': frm.doc.booking_type,
            'tariff_doc': tariff
        });
        
     
        if (frm.doc.booking_channel != "Mobile App"){
        if (frm.doc.multiple_vehicles == 0){
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
                        'booking_type':frm.doc.booking_type,
                        "tariff_doc" : tariff
                    },
                    callback: function(response) {
                        console.log(response.message);
                        const cost = response.message.amount;

                        // Update or create 'transit_charges_item' child table rows
                        const transit_charges = frm.doc.transit_charges_item || [];
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
                                        'booking_type':frm.doc.booking_type,
                                        "tariff_doc" : tariff
                                    },
                                    callback: function(response) {
                                        console.log(response.message,fromcity[0],fromcity[1],"@@@@@@@@@@@@@!!!!!!!!!!!1")
                                         // Update the existing transportation charge row
                                        charge.cost = response.message.amount;
                                        charge.vehicle_type = frm.doc.vehicle_type
                                        console.log(charge.cost)
                                        frm.refresh_field('transit_charges_item');

                                    }

                                })
                                // Update the existing transportation charge row
                                // charge.cost = 0;
                               
                                var fromcity = charge.description.split(" to ")
                                charge.from_location = row.zone
                                charge.to = fromcity[1]
                                charge.vehicle_type = frm.doc.vehicle_type
                                charge.description = row.zone + ' to ' + fromcity[1]; // Updated description
                                frm.refresh_field('transit_charges_item');
                            
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
                                        'booking_type':frm.doc.booking_type,
                                        "tariff_doc" : tariff
                                    },
                                    callback: function(response) {
                                        // console.log(response.message,fromcity[1],row.zone,"@@@@@@@@@@@@@")
                                        //  // Update the existing transportation charge row
                                        charge.cost = response.message.amount;
                                        frm.refresh_field('transit_charges_item');


                                    }

                                })
                               
                               
                                charge.description = fromcity[0] + ' to ' + row.zone 
                                charge.from_location = fromcity[0]
                                charge.to = row.zone
                                charge.vehicle_type = frm.doc.vehicle_type
                                frm.refresh_field('transit_charges_item');
                                updated = true;
                                
                            }
                        }

                        if (!updated) {
                            // Create a new 'transit_charges_item' child table row
                            const transit_charges_row = frm.add_child('transit_charges_item');
                            transit_charges_row.charges = response.message.bill_item;
                            transit_charges_row.quantity = 1;
                            transit_charges_row.description = from_row.zone + ' to ' + row.zone; // Updated description
                            transit_charges_row.cost = cost;
                            transit_charges_row.vehicle_type = frm.doc.vehicle_type
                            transit_charges_row.from_location = from_row.zone
                            transit_charges_row.to = row.zone
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
    else{
        if (transit_details.length > 1) {
            const from_row = transit_details[transit_details.length - 2];
            const to_row = transit_details[transit_details.length - 1];

            // Calculate transportation cost between the current and previous zones
            frappe.call({
                method: 'a3trans.a3trans.events.lead.calculate_transportation_cost',
                args: {
                    'zone': JSON.stringify([from_row.zone, to_row.zone]),
                    'vehicle_type': "1 Ton",
                    'booking_type':frm.doc.booking_type,
                    "tariff_doc" : tariff
                },
                callback: function(response) {
                    console.log(response.message);
                    const cost = 0;

                    // Update or create 'transit_charges_item' child table rows
                    const transit_charges = frm.doc.transit_charges_item || [];
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
                                    'vehicle_type': charge.vehicle_type,
                                    'booking_type':frm.doc.booking_type,
                                    "tariff_doc" : tariff
                                },
                                callback: function(response) {
                                    console.log(response.message,fromcity[0],fromcity[1], response.message.amount,"@@@@@@@@@@@@@!!!!!!!!!!!1")
                                     // Update the existing transportation charge row
                                    charge.cost = response.message.amount;
                                    console.log(charge.cost)
                                    frm.refresh_field('transit_charges_item');

                                }

                            })
                            // Update the existing transportation charge row
                            // charge.cost = 0;
                           
                            var fromcity = charge.description.split(" to ")
                            charge.from_location = row.zone
                            charge.to = fromcity[1]
                            charge.description = row.zone + ' to ' + fromcity[1]; // Updated description
                            frm.refresh_field('transit_charges_item');
                        
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
                                    'vehicle_type': charge.vehicle_type,
                                    'booking_type':frm.doc.booking_type,
                                    "tariff_doc" : tariff
                                },
                                callback: function(response) {
                                    console.log(response.message,fromcity[1],row.zone, response.message.amount,"@@@@@@@@@@@@@")
                                    //  // Update the existing transportation charge row
                                    charge.cost = response.message.amount;
                                    frm.refresh_field('transit_charges_item');


                                }

                            })
                           
                           
                            charge.description = fromcity[0] + ' to ' + row.zone 
                            charge.from_location = fromcity[0]
                            charge.to = row.zone
                            frm.refresh_field('transit_charges_item');
                            updated = true;
                            
                        }
                    }

                    if (!updated) {
                        // Create a new 'transit_charges_item' child table row
                        const transit_charges_row = frm.add_child('transit_charges_item');
                        transit_charges_row.charges = response.message.bill_item;
                        transit_charges_row.quantity = 1;
                        transit_charges_row.description = from_row.zone + ' to ' + row.zone; // Updated description
                        transit_charges_row.cost = cost;
                        transit_charges_row.from_location = from_row.zone
                        transit_charges_row.to = row.zone
                        transit_charges_row.from_id = from_row.index;
                        transit_charges_row.to_id = row.index;
                        frm.refresh_field('transit_charges_item');
                    }
                }
            });
        }

    }
    }
    },


choose_required_loading_service: function(frm, cdt, cdn) {
        var child_load = locals[cdt][cdn];
        var item_selected = child_load.choose_required_loading_service;
        if (!child_load.load_id) {
        // If labour_id is not set, add a new row
        const target_row = frm.add_child('transit_charges_item');
        target_row.charges = item_selected;
        target_row.quantity = 1;
        target_row.description = "Loading Charges"
        child_load.load_id = target_row.idx;
        frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
        frm.refresh_field('transit_charges_item');
        } else {
        // If labour_id is already set, update the existing row
        var existing_row = frm.doc.transit_charges_item.find(row => row.idx === child_load.load_id);
        if (existing_row) {
        if (item_selected) {
        existing_row.charges = item_selected;
        frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
        frm.refresh_field('transit_charges_item');
        } else {
        // Remove the existing row from the child table
        frm.get_field("transit_charges_item").grid.grid_rows[existing_row.idx - 1].remove();
        // Reset child_labour.labour_id after deletion
        child_load.load_id = null;
        }
        } 
        }
        },
   
    
choose_required_labour_service: function(frm, cdt, cdn) {
            var child_labour = locals[cdt][cdn];
            var item_selected = child_labour.choose_required_labour_service;
            if (!child_labour.labour_id) {
            // If labour_id is not set, add a new row
            const target_row = frm.add_child('transit_charges_item');
            target_row.charges = item_selected;
            target_row.quantity = 1;
            target_row.description = "Labour Charges"
            child_labour.labour_id = target_row.idx;
            frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
            frm.refresh_field('transit_charges_item');
            } else {
            // If labour_id is already set, update the existing row
            var existing_row = frm.doc.transit_charges_item.find(row => row.idx === child_labour.labour_id);
            if (existing_row) {
            if (item_selected) {
            existing_row.charges = item_selected;
            frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
            frm.refresh_field('transit_charges_item');
            } else {
            // Remove the existing row from the child table
            frm.get_field("transit_charges_item").grid.grid_rows[existing_row.idx - 1].remove();
            // Reset child_labour.labour_id after deletion
            child_labour.labour_id = null;
            }
            } 
            }
            },
choose_required_handling_service: function(frm, cdt, cdn) {
            var child_handling = locals[cdt][cdn];
            var item_selected = child_handling.choose_required_handling_service;
            if (!child_handling.handle_id) {
            // If handle_id is not set, add a new row
            const target_row = frm.add_child('transit_charges_item');
            target_row.charges = item_selected;
            target_row.quantity = 1;
            target_row.description = "Handling Charges"
            child_handling.handle_id = target_row.idx;
            frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
            frm.refresh_field('transit_charges_item');
            } else {
            // If handle_id is already set, update the existing row
            var existing_row = frm.doc.transit_charges_item.find(row => row.idx === child_handling.handle_id);
            if (existing_row) {
            if (item_selected) {
            existing_row.charges = item_selected;
            frm.script_manager.trigger('charges', existing_row.doctype, existing_row.name);
            frm.refresh_field('transit_charges_item');
            } else {
            // Remove the existing row from the child table
            frm.get_field("transit_charges_item").grid.grid_rows[existing_row.idx - 1].remove();
            // Reset child_handling.handle_id after deletion
            child_handling.handle_id = null;
            }
            } 
            }
            },

});


frappe.ui.form.on('Transit Charges Item', {


	vehicle_type: function(frm, cdt, cdn){
		var child = locals[cdt][cdn];
		let tariff = ""
        if (frm.doc.add_select_tariff){
            tariff = frm.doc.add_select_tariff
        }
        else{
            tariff ="NIL"
        }
        console.log("Arguments for API call:", {
            'zone': JSON.stringify([child.from_location, child.to]),
            'vehicle_type': child.vehicle_type,
            'booking_type': frm.doc.booking_type,
            'tariff_doc': tariff
        });
        
		if (child.vehicle_type && child.from_location && child.to){

			frappe.call({
				method: 'a3trans.a3trans.events.lead.calculate_transportation_cost',
				args: {
				'zone': JSON.stringify([child.from_location, child.to]),
				'vehicle_type': child.vehicle_type,
				'booking_type':frm.doc.booking_type,
                'tariff_doc':tariff
				},
				callback: function(response) {
				console.log(response.message.amount,"@@@@@@@@@@@@@2");
				if (response.message.amount)
                {
				child.cost = response.message.amount
                frm.refresh_field("transit_charges_item")
                }
				else
                {
					child.cost = 0
					frm.script_manager.trigger('cost', child.doctype, child.name)
					
				}
				frm.script_manager.trigger('cost', child.doctype, child.name)
			
				frm.refresh_field("transit_charges_item")
				}
			})

		}

	},

    charges: function(frm, cdt, cdn) {
        const charges_row = locals[cdt][cdn];


if (charges_row.charges) {
    frappe.call({
        method: "a3trans.a3trans.events.opportunity.fetch_charges_price",
        args: {
            charges: charges_row.charges
        },
        callback: function(response) {
            console.log("successs price")
            if (response && response.message) {
                frappe.model.set_value(cdt, cdn, 'cost', response.message["price_list_rate"]);
                frappe.model.set_value(cdt, cdn, 'quantity', 1);
            }
        }
    });
}
    }
})


frappe.ui.form.on('Warehouse Charges', {
    charges: function(frm, cdt, cdn) {   
        const charges_row = locals[cdt][cdn];


        if (charges_row.charges) {
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.fetch_charges_price",
                args: {
                    charges: charges_row.charges
                },
                callback: function(response) {
                    console.log("successs price")
                    if (response && response.message) {
                        frappe.model.set_value(cdt, cdn, 'cost', response.message["price_list_rate"]);
                        frappe.model.set_value(cdt, cdn, 'quantity', 1);
                    }
                }
            });
        }
            }
})



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
