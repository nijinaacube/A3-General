frappe.listview_settings['Opportunity'] = {
  
	onload: function (doc) {
		if (!frappe.route_options) {
			frappe.route_options = {
				owner: frappe.session.user,
				status: "Open",
			};
		}
	}
}