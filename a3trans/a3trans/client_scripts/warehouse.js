
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
    // Whenever warehouse is updated, clear the 'floor_id' field
    frm.set_value('warehouse_floor', null);
    frm.set_value('zone', null);
    frm.set_value('warehouse_shelf', null);
    frm.set_value('warehouse_rack', null);
}
    

})