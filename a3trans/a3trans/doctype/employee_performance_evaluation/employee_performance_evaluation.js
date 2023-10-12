// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Performance Evaluation', {
	onload: function(frm) {
		console.log("hiii")
		if  (frm.is_new()){
            frm.set_value('date', frappe.datetime.get_today());
			frm.set_value('rated_by',frappe.session.user)
			if (frm.doc.order_id){
				frappe.call({
					method: "a3trans.a3trans.doctype.employee_performance_evaluation.employee_performance_evaluation.get_employee",
					args: {
						"doc": frm.doc.order_id
					},
					callback: (r) => {
						console.log(r.message);
		
							
							cur_frm.set_value("employee", r.message["employee"]);
							cur_frm.refresh_field("employee");
							cur_frm.set_value("trip_id", r.message["va_id"]);
							cur_frm.refresh_field("trip_id");

	
							
	
						
					}
				});
			}
          }



	}
});
