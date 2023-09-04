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
                        "item_group": ["not in", ["Diesel", "Packing and Moving"]]
                    }
                };
            };
        }
        
    }
        
})
frappe.ui.form.on('Opportunity', {
    party_name: function(frm) {
        if (frm.doc.party_name && frm.doc.booking_type) {
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.get_addresses",
                args: {
                    "doc": frm.doc.party_name,
                    "type":frm.doc.booking_type
                },
                callback: function(r) {
                    console.log(r.message);

                    // Create arrays to hold multiple values
                    var addressNames = [];
                    var warehousenames = [];

                    // Loop to populate addressNames array
                    r.message.forEach(function(address) {
                        addressNames.push(address.name);

                        frm.fields_dict['receiver_information'].grid.get_field('address').get_query = function(doc, cdt, cdn) {
                            var child = locals[cdt][cdn];
                            return {
                                filters: {
                                    "name": ["in", addressNames],
                                    "address_type":"Shipping"
                                }
                            };
                        };
                    });

                    // Loop to populate warehousenames array
                    r.message.forEach(function(details) {
                        console.log("Details:", details.warehouse);
                        warehousenames.push(details.warehouse);
                        if (warehousenames != ""){

                        frm.fields_dict['warehouse_space_details'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                            var child = locals[cdt][cdn];
                            return {
                                filters: {
                                    "name": ["in", warehousenames]
                                }
                            };
                        };
                    }
                    else{

                        frm.fields_dict['warehouse_space_details'].grid.get_field('warehouse').get_query = function(doc, cdt, cdn) {
                            var child = locals[cdt][cdn];
                            return {
                                filters: {
                                    "disabled":0
                                }
                            };
                        };

                    }
                    });
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