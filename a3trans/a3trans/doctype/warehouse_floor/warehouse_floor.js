// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt

frappe.ui.form.on('Warehouse Floor', {
    onload: function(frm) {
        frm.fields_dict['warehouse'].get_query = function(doc) {
           
                return {
                    filters: {
                        'is_group': 1
                    }
                };
            
        };
    }
});
