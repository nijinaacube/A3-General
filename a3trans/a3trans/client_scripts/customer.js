frappe.ui.form.on('Customer', {
    refresh :function(frm){

        frm.fields_dict['tariff'].get_query = function(doc) {
            
                return {
                    filters: {
                        'is_standard': 1
                    }
                };
            }
        
    }
})