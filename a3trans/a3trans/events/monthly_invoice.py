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

#         opportunity=frappe.get_all("Opportunity")
#         print(opportunity)
#         for oppo in opportunity:
#             oppor=frappe.get_doc("Opportunity",oppo.name)
#             print(oppor,start_of_month,end_of_month,oppor.booking_type)
#             if oppor.booking_type == "Warehouse":
#                     print("hii")
#                     if not frappe.db.exists("Sales Invoice", filters={"posting_date": ["between", (start_of_month, end_of_month)],"order_id":oppor.name}):
                    
#                     # if not frappe.db.exists ("Sales Invoice", {"order_id":oppor.name}):
                        
#                         for itm in oppor.warehouse_space_details:
#                                 print(itm)
#                                 if itm.booked_upto>today:
#                                     ware=frappe.get_doc("Warehouse",itm.warehouse)
#                                     for data in ware.warehouse_item:
#                                         if data.booking_id:
#                                             if data.quantity !=0:
#                                                 sales_invoice=frappe.new_doc("Sales Invoice")
#                                                 sales_invoice.customer = oppor.party_name
#                                                 sales_invoice.customer_name = oppor.customer_name
#                                                 sales_invoice.order_id=oppor.name
#                                                 sales_invoice.booking_type=oppor.booking_type
#                                                 sales_invoice.due_date=frappe.utils.nowdate()
                                                
#                                                 for shipment in oppor.opportunity_line_item:
#                                                         if shipment.item=="Warehouse Space Rent":
#                                                             sales_invoice.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
                                            
#                                                 sales_invoice.insert()
#                                                 sales_invoice.submit()




                    

   

    
