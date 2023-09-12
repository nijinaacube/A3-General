frappe.ui.form.on('Opportunity', {
    refresh: function(frm) {
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
                    frm.clear_table("receiver_information")
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
                            if (frm.doc.booking_type=="Warehouse"){
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
                    frm.clear_table("receiver_information")
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
}
})



frappe.ui.form.on('Transit Details', {

    warehouse: function(frm, cdt, cdn) {
                var child = locals[cdt][cdn];        
                     
                var war=child.warehouse        
                console.log(child.warehouse)   
                if (child.warehouse)    {

                     
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

            // if (child.warehouse==""){
            //                             frappe.model.set_value(cdt, cdn, 'city',"");                    
            //                             frm.refresh_field('city');    
            //                             frappe.model.set_value(cdt, cdn, 'address_line1',"");                    
            //                             frm.refresh_field('address_line1');    
            //                             frappe.model.set_value(cdt, cdn, 'address_line2',"");                    
            //                             frm.refresh_field('address_line1'); 
            //                             frappe.model.set_value(cdt, cdn, 'latitude',"");                    
            //                             frm.refresh_field('latitude');                 
            //                             frappe.model.set_value(cdt, cdn, 'longitude',"");                    
            //                             frm.refresh_field('longitude'); 
            //                             frappe.model.set_value(cdt, cdn, 'contact',"");                    
            //                             frm.refresh_field('contact'); 
                                          
            // }
           
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
                addCharge(frm, child, "Labour Charges");
            } else {
                removeSpecificCharge(frm, child.name, "Labour Charges");
            }
            frm.refresh_field('transit_charges');
        },
    
        handling_required: function(frm, cdt, cdn) {
            const child = locals[cdt][cdn];
            if (child.handling_required == 1) {
                addCharge(frm, child, "Manual Handling Charges");
            } else {
                removeSpecificCharge(frm, child.name, "Manual Handling Charges");
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
        update_order_no(frm);
    },

   



});
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

    onload: function(frm) {

        

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
    date_from:function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (!child.date_to) {
            // Set the current date as the default value for date_from
            // frappe.model.set_value(cdt, cdn, 'date_to', frappe.datetime.now_date());
            // frm.refresh_field('date_to');
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.get_end_of_month",
                args: {
                    current_date_str:frappe.datetime.now_date()
                },
                callback: function(response) {
                    console.log(response.message["end_month"])
                    // Handle callback response if needed
                    frappe.model.set_value(cdt, cdn, 'date_to',response.message["end_month"]);
                    frm.refresh_field('date_to');
                    frappe.model.set_value(cdt, cdn, 'no_of_days',response.message["difference"]);
                    frm.refresh_field('no_of_days');
                    frappe.model.set_value(cdt, cdn, 'rental_charges',"Warehouse Space Rent");
                    frm.refresh_field('rental_charges');
                }
            });
        }
    },
    rental_charges: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (child.no_of_days){
        var no_of_days = child.no_of_days;
        }
        var selected_item=child.rental_charges
        console.log(child.rental_charges)
        const target_row=frm.add_child('warehouse_charges')
		target_row.charges=selected_item
        frm.refresh_field('warehouse_charges');
        frm.script_manager.trigger('charges', target_row.doctype, target_row.name);
       
        
        
        frappe.call({
            method: "a3trans.a3trans.events.opportunity.calculate_charges",
            args: {
                no_of_days: no_of_days, // Pass no_of_days as an argument
                selected_item:selected_item
            },
            callback: function(response) {
                frappe.model.set_value(cdt, cdn, 'rental_cost',response.message["total_amount"]);
                    frm.refresh_field('rental_cost');
                
            }
        });
       
    }
 });


 frappe.ui.form.on('Transit Charges', {

    cost: function(frm, cdt, cdn) {
        const charges_row = locals[cdt][cdn];
 
 
        if (charges_row.charges) {
            let existing_row = null;
            console.log(charges_row,"tttttttttt")
            if (frm.doc.opportunity_line_item && Array.isArray(frm.doc.opportunity_line_item)) {
                existing_row = frm.doc.opportunity_line_item.find(row => row.item && row.item === charges_row.charges);
            }
 
 
            if (existing_row) {
                // If item exists, update its quantity and cost
                existing_row.quantity += charges_row.quantity;
                existing_row.amount += charges_row.cost;
                // Update the average rate
                existing_row.average_rate = existing_row.amount / existing_row.quantity;
            } else {
                // If item doesn't exist, add it as a new row
                const target_row = frm.add_child('opportunity_line_item');
                target_row.item = charges_row.charges;
                target_row.quantity = charges_row.quantity;
                target_row.amount = charges_row.cost;
                target_row.average_rate = target_row.amount / target_row.quantity; // Calculate average rate for the new row
                target_row.transit_charge_ref = charges_row.name;  // Storing reference
            }
            frm.refresh_field('opportunity_line_item');
            // calculateTotalAmount(frm);
        }
    },
    transit_charges_remove: function(frm, cdt, cdn) {
        const groupedData = {};
 
 
        // Group by items in warehouse_charges
        $.each(frm.doc.transit_charges, function(_, charge) {
            if (charge.charges) {
                if (!groupedData[charge.charges]) {
                    groupedData[charge.charges] = {
                        quantity: 0,
                        amount: 0,
                        average_rate: 0,
                        transit_charge_refs: []
                    };
                }
 
 
                groupedData[charge.charges].quantity += charge.quantity;
                groupedData[charge.charges].amount += charge.cost;
                groupedData[charge.charges].transit_charge_refs.push(charge.name);
            }
        });
 
 
        // Update or Add rows in opportunity_line_item
        for (let item in groupedData) {
            const existing_row = frm.doc.opportunity_line_item.find(row => row.item && row.item === item);
           
 
 
            if (existing_row) {
                existing_row.quantity = groupedData[item].quantity;
                existing_row.amount = groupedData[item].amount;
                existing_row.average_rate = existing_row.amount / existing_row.quantity;
            } else {
                const target_row = frm.add_child('opportunity_line_item');
                target_row.item = item;
                target_row.quantity = groupedData[item].quantity;
                target_row.amount = groupedData[item].amount;
                target_row.average_rate = target_row.amount / target_row.quantity;
                target_row.transit_charge_ref = JSON.stringify(groupedData[item].transit_charge_refs);
                frm.script_manager.trigger('amount', target_row.doctype, target_row.name);
            }
        }
 
 
        // Delete rows from opportunity_line_item that are not present in warehouse_charges
        for (let i = frm.doc.opportunity_line_item.length - 1; i >= 0; i--) {
            const row = frm.doc.opportunity_line_item[i];
            if (!groupedData[row.item]) {
                console.log("qqqqqqqqqqqqqqqqqqqqqqqqq")
                frm.get_field('opportunity_line_item').grid.grid_rows[i].remove();
            }
            // calculateTotalAmount(frm);
        }
 
 
        frm.refresh_field('opportunity_line_item');
        // calculateTotalAmount(frm);
    },
   

   






    charges: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var char = child.charges;
        console.log(child.charges);

        if (child.charges) {
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.fetch_charges_price",
                args: {
                    charges: char
                },
                callback: function(response) {
                    console.log(response.message);
                    frappe.model.set_value(cdt, cdn, 'cost',response.message["price_list_rate"]);
                    frm.refresh_field('cost');
                    frappe.model.set_value(cdt, cdn, 'quantity',1);
                    frm.refresh_field('quantity');
                    
                }
            });
        }
    }
});
// function calculateTotalAmount(frm) {
//     let totalAmount = 0;
//     if (frm.doc.opportunity_line_item && Array.isArray(frm.doc.opportunity_line_item)) {
//         frm.doc.opportunity_line_item.forEach(row => {
//             totalAmount += row.amount;
//         });
//     }
 
 
//     // Update the payment_amount field with the totalAmount
//     frm.set_value('payment_amount', totalAmount);
//  }
 
frappe.ui.form.on('Warehouse Stock Items', {
    
    labour_required: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (child.labour_required == 1) {
            handleCharges(frm, child, "Labour Charges", 'add');
        } else if (child.labour_required == 0) {
            handleCharges(frm, child, "Labour Charges", 'remove');
        }
        frm.refresh_field('warehouse_charges');
    },
    
    handling_required: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (child.handling_required == 1) {
            handleCharges(frm, child, "Manual Handling Charges", 'add');
        } else if (child.handling_required == 0) {
            handleCharges(frm, child, "Manual Handling Charges", 'remove');
        }
        frm.refresh_field('warehouse_charges');
    },

    
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
            row.idx = index + 1;       // Adjusting the idx property
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

   
        cost: function(frm, cdt, cdn) {
            const charges_row = locals[cdt][cdn];
     
     
            if (charges_row.charges) {
                let existing_row = null;
               
                if (frm.doc.opportunity_line_item && Array.isArray(frm.doc.opportunity_line_item)) {
                    existing_row = frm.doc.opportunity_line_item.find(row => row.item && row.item === charges_row.charges);
                }
     
     
                if (existing_row) {
                    // If item exists, update its quantity and cost
                    existing_row.quantity += charges_row.quantity;
                    existing_row.amount += charges_row.cost;
                    // Update the average rate
                    existing_row.average_rate = existing_row.amount / existing_row.quantity;
                   
                } else {
                    // If item doesn't exist, add it as a new row
                    const target_row = frm.add_child('opportunity_line_item');
                    target_row.item = charges_row.charges;
                    target_row.quantity = charges_row.quantity;
                    target_row.amount = charges_row.cost;
                    target_row.average_rate = target_row.amount / target_row.quantity; // Calculate average rate for the new row
                    target_row.warehouse_charge_ref = charges_row.name;  // Storing reference

                frm.script_manager.trigger('amount', target_row.doctype, target_row.name);
                }
     
     
                frm.refresh_field('opportunity_line_item');
            }
        },
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
     
     
            // Update or Add rows in opportunity_line_item
            for (let item in groupedData) {
                const existing_row = frm.doc.opportunity_line_item.find(row => row.item && row.item === item);
     
     
                if (existing_row) {
                    existing_row.quantity = groupedData[item].quantity;
                    existing_row.amount = groupedData[item].amount;
                    existing_row.average_rate = existing_row.amount / existing_row.quantity;
                } else {
                    const target_row = frm.add_child('opportunity_line_item');
                    target_row.item = item;
                    target_row.quantity = groupedData[item].quantity;
                    target_row.amount = groupedData[item].amount;
                    target_row.average_rate = target_row.amount / target_row.quantity;
                    target_row.warehouse_charge_ref = JSON.stringify(groupedData[item].warehouse_charge_refs);
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
       
     


    charges: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var char = child.charges;
        console.log(child.charges);

        if (child.charges) {
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.fetch_charges_price",
                args: {
                    charges: char
                },
                callback: function(response) {
                    console.log(response.message);
                    frappe.model.set_value(cdt, cdn, 'cost',response.message["price_list_rate"]);
                    frm.refresh_field('cost');
                    frappe.model.set_value(cdt, cdn, 'quantity',1);
                    frm.refresh_field('quantity');
                    
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


