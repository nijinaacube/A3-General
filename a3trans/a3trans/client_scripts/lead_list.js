frappe.listview_settings['Lead'] = {
  
	onload: function (doc) {
		if (!frappe.route_options) {
			frappe.route_options = {
				owner: frappe.session.user,
				status: "Lead",
			};
		}
	}
}