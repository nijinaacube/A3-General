frappe.ui.form.on('Lead', {
    onload :function(frm){
        if  (frm.is_new()){
            frm.set_value('booking_date', frappe.datetime.get_today());

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

}
});



frappe.ui.form.on('Transit Details Item', {
	zone: function(frm, cdt, cdn) {
	
        if (frm.doc.vehicle_type){
        const zones = frm.doc.transit_details_item.map(receiver => receiver.zone);
        
    
        
        if (!frm.doc.transit_details_item) {
            frm.doc.transit_details_item = [];
        }
    
        if (zones.length == 2) {
    
            // Calculate cost and add transportation charge
            let from_zone = zones[0];
            let to_zone = zones[1];
            if (frm.doc.vehicle_type) {
               
                frappe.call({
                    method: "a3trans.a3trans.events.lead.calculate_transportation_cost",
                    args: {
                        
                        "zone": JSON.stringify([from_zone, to_zone]),
                        "vehicle_type": frm.doc.vehicle_type,
                        "length": frm.doc.transit_details_item.length
                    },
                    callback: function(response) {
                        
                        
                            
                                console.log(response.message,"**********")
                            if (!frm.doc.trans_id) {
                                console.log(response.message)
                                const target_row = frm.add_child('transit_charges_item');
                                target_row.charges = "Transportation Charges";
                                target_row.quantity = 1;
                                target_row.from_zone = from_zone;
                                target_row.to_zone = to_zone;
                                frm.doc.trans_id=target_row.idx
                                target_row.description=zones[zones.length-2]+" "+"to"+" "+zones[zones.length-1];
                                target_row.cost = response.message;
                                frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                                frm.refresh_field('transit_charges_item');
                            }
                            else{
                                var existing_row = frm.doc.transit_charges_item.find(row => row.idx === frm.doc.trans_id);
                                if (existing_row){
                                    existing_row.description=zones[zones.length-2]+" "+"to"+" "+zones[zones.length-1];
                                existing_row.cost = response.message;
                                frm.script_manager.trigger('cost', existing_row.doctype, existing_row.name);
                                frm.refresh_field('transit_charges_item');
                                }
                                else{
                                    
                            
                                        const target_row = frm.add_child('transit_charges_item');
                                        
                                        target_row.cost = 0;
                                        frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
                                        frm.refresh_field('transit_charges_item');
                                                
                                            
                                }
    
                                
                            }
    
                        
                        
                        
                    }
                });
            }
        }
        if(zones.length > 2){
            
            console.log(zones[0],zones[1],zones[2])
            const target_row = frm.add_child('transit_charges_item');
            target_row.charges = "Transportation Charges";
            target_row.quantity = 1;
            target_row.cost=0
            target_row.description=zones[zones.length-2]+" "+"to"+" "+zones[zones.length-1];
            frm.script_manager.trigger('cost', target_row.doctype, target_row.name);
            frm.refresh_field('transit_charges_item');
            
            
            
            
            }
            
    }
    else{
        frappe.throw("Please choose vehicle type")
    }
    
    },
})

