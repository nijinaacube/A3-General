// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt






frappe.ui.form.on('Vehicle Assignment', {
    refresh: function(frm) {
        if  (frm.is_new()){
            frm.set_value('assignment_date', frappe.datetime.get_today());
          }
        frm.add_custom_button(__('Get Orders'), function() {
            // Clear existing routes before adding new ones
            frm.clear_table('routes');
 
 
            var dialog = new frappe.ui.form.MultiSelectDialog({
                doctype: 'Opportunity',
                target: frm,
                setters: {
                    // status: 'Converted',
                    party_name:frm.doc.party_name,
                    booking_date:frm.doc.booking_date,
                    vehicle_type:frm.doc.vehicle_type,
                    booking_type:frm.doc.booking_type
 
 
                },
                add_filters_group: 1,
                // allow_child_item_selection: 1,
                // child_fieldname: 'receiver_information',
                columns: ['party_name'],
                get_query() {
                    return {
                        filters: { status: ['=', 'converted'] ,order_status:['=','New']}
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
                                        child.order_no = pickupRow.order_no
                                        child.zone = pickupRow.zone;
                                        child.transit_type = pickupRow.transit_type;
                                        child.latitude=pickupRow.latitude;
                                        child.longitude=pickupRow.longitude
                                    });
                               
                              
                                    // if (oppo.pickup_from_warehouse){
                                    //     oppo.pickup_from_warehouse.forEach(function(Row) {
                                    //         var child = frm.add_child('routes', {});
                                    //         child.order_id = opportunity;
                                    //         child.location = Row.warehouse;
           
                                    //         child.type_of_location = "Pickup";
                                    //     });
                                   
                                    $.each(frm.doc.routes, function(index, row) {
                                        row.order_no = index + 1;
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
                        "role"  :   "Helper"
                    }
                 }
                }
        },
 
 
 
 
 
 
 vehicle_id:function(frm) {
 
 
 
 
    if (frm.doc.vehicle_id){
 
 
        frappe.call({
            method:"a3trans.a3trans.doctype.vehicle_assignment.vehicle_assignment.get_staff_data",
            args: {
       
                vehicle_id: frm.doc.vehicle_id,
            },
            callback: (r) => {
                console.log(r.message)
                cur_frm.set_value("driver_id", r.message["assigned_driver"]);
                frm.refresh_field('driver_id');
                cur_frm.set_value("helper_id", r.message["assigned_helper"]);
                frm.refresh_field('helper_id');
           
            }
        })
        }
     
 },
 order: function(frm) {
    frappe.call({
        method: "a3trans.a3trans.doctype.vehicle_assignment.vehicle_assignment.fetch_order_details",
        args: {
            "order_id": frm.doc.order,
        },
        callback: function(response) {
            if (response.message && Array.isArray(response.message)) {
                // Clear the existing rows in the "routes" child table
                frm.clear_table("routes");

                // Loop through the list of dictionaries in the response
                response.message.forEach(function(item) {
                    var target_row = frm.add_child("routes");

                    // Set values for the fields of the new row
                    target_row.order_id = frm.doc.order;
                    target_row.order_no = item.order_no;
                    target_row.transit_type = item.type;
                    target_row.zone=item.zone
                    target_row.lat=item.latitude
                    target_row.lon=item.longitude

                    // Add the new row to the "routes" child table
                    frm.refresh_field("routes");
                });
            }
        }
    });
},
})

 
 
 

 
 
 
 
 
 
   
 