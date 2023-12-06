frappe.listview_settings['Opportunity'] = {
    onload: function (listview) {
        if (!frappe.route_options) {
            frappe.route_options = {
                owner: frappe.session.user,
                status: "Open",
            };
        }
    },
	// get_indicator:function(doc){
	// 	if (doc.status === "Overdue") {
	// 				return [__("Overdue"), "red", "status,=,Overdue"];
	// 	}
	// }
};
