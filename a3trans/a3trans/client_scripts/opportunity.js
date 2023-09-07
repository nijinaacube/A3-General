


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
                    frm.fields_dict['warehouse_space_details'].grid.get_field('floor_id').get_query = function(doc, cdt, cdn) {
                        var selectedWarehouse = locals[cdt][cdn].warehouse;
                        if (r.message.length > 0)
                        {
                        return {
                            filters: {
                                "warehouse": ["in", selectedWarehouse]
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
 
 
                    frm.fields_dict['warehouse_space_details'].grid.get_field('zone').get_query = function(doc, cdt, cdn) {
                        var selectedfloor = locals[cdt][cdn].floor_id;
                            if (r.message.length > 0) {
                            return {
                                filters: {
                                    "floor": ["in", selectedfloor]
                                }
                            };
                           
                        }
                      
                        else{
     
     
     
     
                        return {
                            filters: {
                                "floor": ["in", ""]
                            }
                        };
                        }
                           
                        }
                        frm.fields_dict['warehouse_space_details'].grid.refresh();
     
     
                        frm.fields_dict['warehouse_space_details'].grid.get_field('shelf_id').get_query = function(doc, cdt, cdn) {
                            var selectedfloor = locals[cdt][cdn].floor_id;
                                if (r.message.length > 0) {
                                return {
                                    filters: {
                                        "floor_id": ["in", selectedfloor]
                                    }
                                };
                               
                            }
                           
                        else{
     
     
     
     
                        return {
                            filters: {
                                "floor_id": ["in", ""]
                            }
                        };
                        }
                           
                        }
                        frm.fields_dict['warehouse_space_details'].grid.refresh();


                        frm.fields_dict['warehouse_space_details'].grid.get_field('rack_id').get_query = function(doc, cdt, cdn) {
                            var selectedshelf = locals[cdt][cdn].shelf_id;
                                if (r.message.length > 0) {
                                return {
                                    filters: {
                                        "warehouse_shelf": ["in", selectedshelf]
                                    }
                                };
                               
                            }
                           
                        else{
     
     
     
     
                        return {
                            filters: {
                                "warehouse_shelf": ["in", ""]
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
                    target_row.order_no=1
                
					frm.refresh_field('receiver_information');
                       
                     
                    }
                  
                }
            })




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

            if (child.warehouse==""){
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
    receiver_information_add: function(frm, cdt, cdn) {
        update_order_no(frm);
    },
    receiver_information_remove: function(frm, cdt, cdn) {
        update_order_no(frm);
    },

   



});

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
        var child = locals[cdt][cdn];
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
                }
            });
        }
    },
    rental_charges: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var no_of_days = child.no_of_days;
        var selected_item=child.rental_charges
        console.log(child.rental_charges)
         // Get the value of no_of_days
        // Now, you can use 'no_of_days' in your Frappe call as an argument
        frappe.call({
            method: "a3trans.a3trans.events.opportunity.calculate_charges",
            args: {
                no_of_days: no_of_days, // Pass no_of_days as an argument
                selected_item:selected_item
            },
            callback: function(response) {
                frappe.model.set_value(cdt, cdn, 'rental_cost',response.message["total_amount"]);
                    frm.refresh_field('rental_cost');
                // Handle the response of your Frappe call here
            }
        });
    }
 });
 