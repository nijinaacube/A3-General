# import frappe
# from datetime import datetime, timedelta
# from frappe.utils import get_last_day

# def create_invoices():
#     today = datetime.now().date()
#     print(today,"kkkkkk")
#     end_of_last_month = get_last_day(today.replace(day=1) - timedelta(days=1))
    
#     while end_of_last_month < today:
#         start_of_month = end_of_last_month.replace(day=1)
#         end_of_month = get_last_day(start_of_month)
        
        
#         # Move to the next month
#         end_of_last_month = get_last_day(end_of_month + timedelta(days=1))

#     # Check if invoices exist for the specified date range
#     invoices = frappe.get_all("Sales Invoice", filters={"posting_date": ["between", (start_of_month, end_of_month)]})
#     print(invoices)
