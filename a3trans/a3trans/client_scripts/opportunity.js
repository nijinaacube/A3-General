frappe.ui.form.on('Transit Details', {
  
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
                frm.fields_dict['receiver_information'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                    
                    return {
                        filters: {
                           
                            "is_group": 0,
                            "disabled":0
                        }
                    };
                };

                frm.fields_dict['warehouse_space_details'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                    
                    return {
                        filters: {
                           
                            "is_group": 0,
                            "disabled":0
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
                        if (r.message.length > 0) {
                        frm.fields_dict['receiver_information'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                            return {
                                filters: {
                                    "name": ["in", r.message]
                                }
                            };
                        };


          
                  
                        frm.fields_dict['receiver_information'].grid.refresh();



                    }
                }





            }
            });
        }
 



        if (frm.doc.party_name && frm.doc.booking_type) {
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.get_addresses",
                args: {
                    "doc": frm.doc.party_name,
                    "type": frm.doc.booking_type
                },
                callback: function(r) {
                    console.log("Callback received:", r.message);
                    
                    var addressNames = [];
                    // var warehousenames = [];

                    if (Array.isArray(r.message)) {
                        r.message.forEach(function(detail) {
                            if (detail.name) {
                                addressNames.push(detail.name);
                            }
                            // if (detail.warehouse) {
                            //     warehousenames.push(detail.warehouse);
                            // }
                        });
                    }

                    console.log("Address Names:", addressNames);
                  

                    frm.fields_dict['receiver_information'].grid.get_field('address').get_query = function(doc, cdt, cdn) {
                        console.log("Setting query for Address");
                        if (addressNames.length > 0){
                        return {
                            filters: {
                                "name": ["in", addressNames],
                                "address_type": "Shipping"
                            }
                        };
                    };
                }
                    // Populate this array with actual addresses returned
                    frm.fields_dict['receiver_information'].grid.get_field('address').df.hidden
                    
                    // Refresh to see the changes take effect
                    frm.refresh_field('receiver_information');
                

                    // frm.fields_dict['warehouse_space_details'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                    //     console.log("Setting query for Warehouse");
                    //     if (warehousenames.length > 0) {
                    //         return {
                    //             filters: {
                    //                 "name": ["in", warehousenames]
                    //             }
                    //         };
                    //     } else {


                    //         return {
                    //             filters: {
                    //                 "disabled": 0
                    //             }
                    //         };
                    //     }
                    // };

                   
                }
            });
        }
    }
});



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



