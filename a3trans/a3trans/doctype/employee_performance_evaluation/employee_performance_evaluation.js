// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Performance Evaluation', {
	onload: function(frm) {
		if  (frm.is_new()){
            frm.set_value('date', frappe.datetime.get_today());
			frm.set_value('rated_by',frappe.session.user)
          }



	}
});
