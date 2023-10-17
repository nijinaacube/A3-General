// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt






frappe.ui.form.on('Vehicle Assignment', {
    refresh: function(frm) {
        if  (frm.is_new()){
            frm.set_value('assignment_date', frappe.datetime.get_today());
          
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
                                    if (oppo.has_return_trip == 1){
                                        frm.clear_table("return_trips");
                                        frm.set_value("has_return",oppo.has_return_trip)
                                        frm.refresh_field("has_return")

                                        oppo.return_trips.forEach(function(tripRow) {
                                            var child = frm.add_child('return_trips', {});
                                            child.order_id = opportunity;
                                            child.order_no = tripRow.order_no
                                            child.zone = tripRow.zone;
                                            child.transit_type = tripRow.transit_type;
                                            child.latitude=tripRow.latitude;
                                            child.longitude=tripRow.longitude
                                                
                                    $.each(frm.doc.return_trips, function(index, row) {
                                        row.order_no = index + 1;
                                    });
                                            frm.refresh_field('return_trips');
                                        });
                                    }
                               
                              
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
    }
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
   // This is where your 'order' field change event is handled
   order: function (frm) {
    if (frm.doc.order) {
        frappe.call({
            method: "a3trans.a3trans.doctype.vehicle_assignment.vehicle_assignment.fetch_order_details",
            args: {
                "order_id": frm.doc.order,
            },
            callback: function (response) {
                if (response.message) {
                    console.log(response.message);

                    // Clear the existing rows in the "routes" and "return_trips" child tables
                    frm.clear_table("routes");
                    frm.clear_table("return_trips");

                    // Loop through the response.message.data1
                    for (var i in response.message.data1) {
                        var item = response.message.data1[i];

                        // Add a new row to the "routes" child table
                        var target_row = frm.add_child("routes");

                        // Set values for the fields of the new row
                        target_row.order_id = frm.doc.order
                        target_row.order_no = item.order_no;
                        target_row.transit_type = item.type;
                        target_row.zone = item.zone;
                        target_row.lat = item.lat;
                        target_row.lon = item.lon;
                        target_row.remark = item.remark;

                        frm.refresh_field("routes");
                    }
                    // Update the "has_return" field
                    frm.set_value("has_return", response.message.has_trip);
                    frm.refresh_field("has_return");
                    // Loop through the response.message.data2
                    for (var i in response.message.data2) {
                        var items = response.message.data2[i];

                        // Add a new row to the "return_trips" child table
                        var tripRow = frm.add_child("return_trips");
                        tripRow.order_id = frm.doc.order;
                        tripRow.order_no = items.trip_order_no;
                        tripRow.transit_type = items.trip_type;
                        tripRow.zone = items.trip_zone;
                        tripRow.lat = items.trip_lat;
                        tripRow.lon = items.trip_lon;
                        tripRow.remark = items.trip_remark;

                        frm.refresh_field('return_trips');
                    }

                 
                }
            }
        });
    }
}
});

 
 
 
 
 
 
   
 