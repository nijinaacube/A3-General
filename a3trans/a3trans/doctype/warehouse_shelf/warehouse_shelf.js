// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt

frappe.ui.form.on('Warehouse Shelf', {
    onload: function(frm) {
        // Filter for 'warehouse' field
        frm.fields_dict['warehouse'].get_query = function(doc) {
            return {
                filters: {
                    'is_group': 1
                }
            };
        };

        // Filter for 'floor_id' field
        frm.fields_dict['floor_id'].get_query = function(doc) {
            if (doc.warehouse) {
                return {
                    filters: {
                        'warehouse': doc.warehouse
                    }
                };
            }
            // If no warehouse is selected, no floors will be shown
            return {
                filters: {
                    'warehouse': ''
                }
            };
        };
		frm.fields_dict['zone'].get_query = function(doc) {
            if (doc.warehouse) {
                return {
                    filters: {
                        'warehouse': doc.warehouse
                    }
                };
            }
            // If no warehouse is selected, no floors will be shown
            return {
                filters: {
                    'warehouse': ''
                }
            };
        };
    },
    warehouse: function(frm) {
        // Whenever warehouse is updated, clear the 'floor_id' field
        frm.set_value('floor_id', null);
		frm.set_value('zone', null);
    }
});
