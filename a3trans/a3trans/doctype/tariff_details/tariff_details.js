// Copyright (c) 2023, Nijina A and contributors
// For license information, please see license.txt


frappe.ui.form.on('Tariff Details', {
  
	onload: function (frm) {
		var prev_route = frappe.get_prev_route();
	   
	   
	   
		if (prev_route[1] === 'Lead') {
   
			let source_doc = frappe.model.get_doc('Lead', prev_route[2]);
			console.log("Success",source_doc)
			frm.set_value("lead_id",source_doc.name );
			frm.refresh_field('lead_id');
	   


		}
	},
	lead_id:  function(frm){


		frappe.call({
			method: "a3trans.a3trans.doctype.tariff_details.tariff_details.get_contact",
			args: {
				"doc": frm.doc.lead_id,
			},
			callback: function(r) {
				if (r.message) {
					console.log(r.message)
			frm.set_value("contact",r.message );
			frm.refresh_field('contact');


			
				}
			}
		});
	}

});
