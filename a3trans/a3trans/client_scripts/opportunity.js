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
        if (frm.doc.party_name) {
            frappe.call({
                method: "a3trans.a3trans.events.opportunity.get_addresses",
                args: {
                    "doc": frm.doc.party_name
                },
                callback: function(r) {
                    console.log(r.message);

                    var addressNames = r.message.map(function(address) {
                        return address.name;
                    });

                    frm.fields_dict['receiver_information'].grid.get_field('address').get_query = function(doc, cdt, cdn) {
                        var child = locals[cdt][cdn];
                        return {
                            filters: {
                                "name": ["in", addressNames],
                                "address_type":"Shipping"
                            }
                        };
                    };
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
        // cur_frm.set_value("type_of_id", r.message["id_proof_type"]);
        // cur_frm.set_value("id_number1", r.message["id_proof_number"]);
        // cur_frm.set_value("id_proof1", r.message["attach_id"]);
        // cur_frm.set_value("email_id", r.message["email"]);
        // cur_frm.set_value("address_line1", r.message["ad1"]);
        // cur_frm.set_value("address_line_b", r.message["ad2"]);
        // cur_frm.set_value("city1", r.message["ad3"]);
        // cur_frm.set_value("pin_code1", r.message["pin"]);
        frm.refresh_field('party_name');
        // frm.refresh_field('address_line_b');
        // frm.refresh_field('city1');
        // frm.refresh_field('pin_code1');
        // frm.refresh_field('email_id');
        // frm.refresh_field('type_of_id');
        // frm.refresh_field('name1');
        // frm.refresh_field('id_number1');
        // frm.refresh_field('id_proof1');
    }
})
}
}
})