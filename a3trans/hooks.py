from . import __version__ as app_version

app_name = "a3trans"
app_title = "A3Trans"
app_publisher = "Nijina A"
app_description = "Efficient Dispatching and tracking solution"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "njna@acube.co"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/a3trans/css/a3trans.css"
# app_include_js = "/assets/a3trans/js/a3trans.js"

# include js, css files in header of web template
# web_include_css = "/assets/a3trans/css/a3trans.css"
# web_include_js = "/assets/a3trans/js/a3trans.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "a3trans/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
doctype_list_js = {"Opportunity" : "a3trans/client_scripts/opportunity_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "a3trans.install.before_install"
# after_install = "a3trans.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "a3trans.uninstall.before_uninstall"
# after_uninstall = "a3trans.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "a3trans.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }



fixtures = [

{'dt':"Role","filters":[
	['name',"in",
	["Driver","Helper","Operator"]
	]
]},
  {"dt": "Custom DocPerm", "filters": [
			[
			"role", "in", [
					"Operator",
				   
					"Guest"
				   ]
				]
  ]
			},
]

doctype_js = {
   "Opportunity": "a3trans/client_scripts/opportunity.js",
   "Warehouse": "a3trans/client_scripts/warehouse.js",
   "Delivery Note":"a3trans/client_scripts/delivery_note.js",
   "Stock Entry":"a3trans/client_scripts/stock_entry.js",
   "Sales Invoice":"a3trans/client_scripts/sales_invoice.js",
   "Payment Entry":"a3trans/client_scripts/payment_entry.js",
   "Lead":"a3trans/client_scripts/lead.js",
   "Address":"a3trans/client_scripts/address.js",
   "Vehicle":"a3trans/client_scripts/vehicle.js",

  
}

doc_events = {
    "Customer": {
       "after_insert":"a3trans.a3trans.events.customer.after_insert"
    },
     "Lead": {
       "validate":"a3trans.a3trans.events.lead.validate",
       "after_insert":"a3trans.a3trans.events.lead.after_insert"
    },
    "Opportunity":{
       "validate":"a3trans.a3trans.events.opportunity.validate",
       "after_insert":"a3trans.a3trans.events.opportunity.after_insert"

    },
   #  "Warehouse":{
   #     # "validate":"a3trans.a3trans.events.warehouse.validate",
   #     "after_insert":"a3trans.a3trans.events.warehouse.after_insert"
   #  },
    "Delivery Note":{
       "on_submit":"a3trans.a3trans.events.delivery_note.on_submit",
        "on_submit":"a3trans.a3trans.events.sales_invoice.attach_pdf"

    },
   "Sales Invoice":{
   "after_insert": "a3trans.a3trans.events.sales_invoice.after_insert",
   "on_submit":"a3trans.a3trans.events.sales_invoice.attach_pdf",
   
   },


   "Stock Entry":{
       "on_submit":"a3trans.a3trans.events.stock_entry.on_submit"
    },


   "Address":{
       "after_insert":"a3trans.a3trans.events.address.after_insert",
       "validate":"a3trans.a3trans.events.address.validate"
    },
   
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
	
# #	"all": [
# #		"a3trans.tasks.all"
# #	],
# "cron":{
# 		"*/1 * * * *":[
# 			"a3trans.a3trans.events.monthly_invoice.create_invoices"
# 		]
# 	},
#	"daily": [
#		"a3trans.tasks.daily"
#	],
#	"hourly": [
#		"a3trans.tasks.hourly"
#	],
#	"weekly": [
#		"a3trans.tasks.weekly"
#	]
	# "monthly": [
	# "a3trans.a3trans.events.monthly_invoice.create_invoices"
	# ]
#  }

# Testing
# -------

# before_tests = "a3trans.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "a3trans.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "a3trans.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Request Events
# ----------------
# before_request = ["a3trans.utils.before_request"]
# after_request = ["a3trans.utils.after_request"]

# Job Events
# ----------
# before_job = ["a3trans.utils.before_job"]
# after_job = ["a3trans.utils.after_job"]

# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"a3trans.auth.validate"
# ]

