
frappe.ui.form.on('Warehouse', {
    onload: function(frm) {

    frm.fields_dict['warehouse_floor'].get_query = function(doc) {
        if (doc.parent_warehouse) {
            return {
                filters: {
                    'warehouse': doc.parent_warehouse
                }
            };
        }
        // If no warehouse is selected, no floors will be shown
        return {
            filters: {
                'warehouse': ''
            }
        };
    
}


frm.fields_dict['zone'].get_query = function(doc) {
    if (doc.parent_warehouse) {
        return {
            filters: {
                'warehouse': doc.parent_warehouse
            }
        };
    }
    // If no warehouse is selected, no floors will be shown
    return {
        filters: {
            'warehouse': ''
        }
    };

}

frm.fields_dict['warehouse_shelf'].get_query = function(doc) {
    if (doc.parent_warehouse) {
        return {
            filters: {
                'warehouse': doc.parent_warehouse
            }
        };
    }
    // If no warehouse is selected, no floors will be shown
    return {
        filters: {
            'warehouse': ''
        }
    };

}


frm.fields_dict['warehouse_rack'].get_query = function(doc) {
    if (doc.parent_warehouse) {
        return {
            filters: {
                'warehouse': doc.parent_warehouse
            }
        };
    }
    // If no warehouse is selected, no floors will be shown
    return {
        filters: {
            'warehouse': ''
        }
    };

}
    },
parent_warehouse: function(frm) {
    if (frm.doc.parent_warehouse){
        frappe.call({
            method: "a3trans.a3trans.events.warehouse.get_warehouseaddress",
            args: {
                "doc": frm.doc.parent_warehouse
            },
            callback: (r) => {
                console.log(r.message);
                frm.set_value('phone_no', r.message["phone"]);
                frm.set_value('address_line_1', r.message["add1"]);
                frm.set_value('address_line_2', r.message["add2"]);
                frm.set_value('city', r.message["city"]);
                frm.refresh_field("phone_no")
                frm.refresh_field("address_line_1")
                frm.refresh_field("address_line_2")
                frm.refresh_field("city")

                

            }
        })

    }
    // Whenever warehouse is updated, clear the 'floor_id' field
    frm.set_value('warehouse_floor', null);
    frm.set_value('zone', null);
    frm.set_value('warehouse_shelf', null);
    frm.set_value('warehouse_rack', null);
}
    

})