frappe.ui.form.on('Opportunity', {

    onload: function(frm) {
        if (frm.doc.booking_type = "Packing and Moving") {

            
            frm.fields_dict['packing_items'].grid.get_field('item_name').get_query = function(doc, cdt, cdn) {
                var child = locals[cdt][cdn]
                return {
                    filters: {
                        "item_group": ["=", "Packing and Moving"]
                    }
                };
            };
        }
      
        if (frm.doc.booking_type !== "Diesel") {
            console.log("Filtering item groups");
            frm.fields_dict['shipment_details'].grid.get_field('item').get_query = function(doc, cdt, cdn) {
                console.log("Querying items");
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
