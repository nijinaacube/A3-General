import frappe
from datetime import date
from datetime import date
from datetime import datetime
import calendar
from functools import reduce
from frappe.utils import add_to_date

def after_insert(doc, methods):
    if doc.booking_type == "Transport":
        doc.transportation_required =1
    if doc.required_transit == 1:
        doc.transportation_required = 1
    doc.db_update()
  
    if doc.lead_id == "" or doc.lead_id == None:
            
        if doc.party_name:
                # if doc.create_invoices==1:
                    if doc.opportunity_line_item:
                
                        #Create sales order   
                        if doc.booking_type == "Transport" or doc.booking_type == "Warehousing":
                            if doc.opportunity_line_item:
                                # Collect items with include_in_billing checkbox equal to 1
                                items_to_include = []
                                for shipment in doc.opportunity_line_item:
                                    if shipment.include_in_billing == 1:
                                        items_to_include.append({
                                            "item_code": shipment.item,
                                            "qty": shipment.quantity,
                                            "rate": shipment.average_rate,
                                            "item_name":shipment.item,
                                            "uom": "Nos",
                                            "description":shipment.item,
                                            "conversion_factor":1

                                        })

                                        # Check if Sales Order with the same booking_id already exists
                                        if not frappe.db.exists("Sales Order", {"booking_id": doc.name}):
                                            # Create a new Sales Order
                                            sales_order = frappe.new_doc("Sales Order")
                                            sales_order.customer = doc.party_name
                                            sales_order.customer_name = doc.customer_name
                                            sales_order.booking_id = doc.name
                                            sales_order.booking_type = doc.booking_type
                                            sales_order.booking_status = "New"
                                            sales_order.delivery_date = frappe.utils.nowdate()
                                            # Append items to the Sales Order
                                            for item_data in items_to_include:
                                                sales_order.append("items", item_data)
                                            sales_order.save()
                                            sales_order.submit()
                                            # frappe.throw("kkk")

                   # Create sales invoice
                    # if doc.payment_amount != 0:
                    #     if not frappe.db.exists("Sales Invoice", {"order_id": doc.name}):

                    #         if doc.booking_type == "Transport" or doc.booking_type == "Warehousing":
                    #             for shipment in doc.opportunity_line_item:
                    #                 if shipment.include_in_billing == 1:
                    #                     # Create a new Sales Invoice
                    #                     sales_invoice = frappe.new_doc("Sales Invoice")
                    #                     sales_invoice.customer = doc.party_name
                    #                     sales_invoice.customer_name = doc.customer_name
                    #                     sales_invoice.order_id = doc.name
                    #                     sales_invoice.booking_type = doc.booking_type
                    #                     # if doc.job_number:
                    #                     #     sales_invoice.job_number = doc.job_number
                    #                     sales_invoice.order_status = "New"
                    #                     sales_invoice.due_date = frappe.utils.nowdate()
                    #                     sales_invoice.append("items", {
                    #                         "item_code": shipment.item,
                    #                         "qty": shipment.quantity,
                    #                         "rate": shipment.average_rate
                    #                     })

                    #                     sales_invoice.insert()
                    #                     doc.invoice_id = sales_invoice.name

                        doc.status = "Converted"
                


     
    if doc.lead_id:
        lead_doc = frappe.get_doc("Lead", doc.lead_id)
        print(lead_doc.status, doc.status, lead_doc.contact_by)

        # Check if 'contact_by' is available and valid
        if lead_doc.contact_by:
            sharedoc = frappe.new_doc("DocShare")
            sharedoc.share_doctype = "Lead"
            sharedoc.share_name = doc.lead_id
            sharedoc.user = lead_doc.contact_by
            sharedoc.read = 1
            sharedoc.write = 1
            sharedoc.share = 1
            sharedoc.notify = 1
            sharedoc.report = 1
            sharedoc.save(ignore_permissions=True)


            sharedoc = frappe.new_doc("DocShare")
            sharedoc.share_doctype = "Opportunity"
            sharedoc.share_name = doc.name
            sharedoc.user = lead_doc.contact_by
            sharedoc.read = 1
            sharedoc.write = 1
            sharedoc.share = 1
            sharedoc.notify = 1
            sharedoc.report = 1
            sharedoc.save(ignore_permissions=True)
            print(lead_doc, "##################")
            print(lead_doc.status, doc.status, lead_doc.contact_by)

            todo = frappe.new_doc("ToDo")
            todo.date = lead_doc.ends_on
            todo.owner = lead_doc.contact_by
            todo.description = "Please follow-up and complete the booking"
            todo.reference_type = "Opportunity"
            todo.reference_name = doc.name

            todo.save()
            frappe.msgprint('Opportunity ' f'<a href="/app/opportunity/{doc.name}" target="blank">{doc.name} </a> assigned to {lead_doc.contact_by} ')

            # frappe.msgprint(f"Opportunity {doc.name} assigned to {lead_doc.contact_by}")
      
    if doc.booking_type == "Warehousing":
        if doc.warehouse_space_details:

            for war in doc.warehouse_space_details:
                for itm in doc.warehouse_stock_items:
                    if war.warehouse:
                        warehouses = frappe.get_doc("Warehouse", war.warehouse)
                        warehouses.append("warehouse_item",{"booking_id":doc.name,"item":itm.item,"quantity":itm.quantity,"floor_id":war.floor_id,"shelf_id":war.shelf_id,"rack_id":war.rack_id,"zone":war.zone,"status":"Pending"})       
                        warehouses.save()


                    # if doc.party_name:
                    #     customer=frappe.get_doc("Customer",doc.party_name)
                    #     print(customer)
                    #     fromdate=frappe.utils.nowdate()
                    #     dur=int(war.no_of_days)
                    #     todate=add_to_date(fromdate,days=dur,as_string=True)   
                    #     table_len=len(customer.customer_warehouse_details)                           
                    #     if table_len ==0:                               
                    #         customer.append("customer_warehouse_details",{"warehouse":war.warehouse,"from":fromdate,"to":todate})                           
                    #     else:                               
                    #         for warehouses_det in customer.customer_warehouse_details:                                   
                    #             if  war.warehouse not in warehouses_det.warehouse:                                       
                    #                 customer.append("customer_warehouse_details",{"warehouse":war.warehouse,"from":fromdate,"to":todate})                           
                    #     customer.save()

def validate(doc, method):
    if doc.status == "Lost":
        doc.order_status = "Cancelled"
        print(doc.order_lost_reason, "*******************************")
        if frappe.db.exists("Sales Invoice",{"order_id":doc.name}):
            invoice_list = frappe.get_list("Sales Invoice", {"order_id": doc.name})
            for inv in invoice_list:
                invoice = frappe.get_doc("Sales Invoice", inv.name)
                if invoice.status != "Cancelled" and invoice.docstatus ==1:
                    invoice.order_status = "Cancelled"
                    invoice.cancel()
        if frappe.db.exists("Sales Order",{"booking_id":doc.name}):
            order_list = frappe.get_list("Sales Order", {"booking_id": doc.name})
            for ord in order_list:
                sale_order = frappe.get_doc("Sales Order", ord.name)
                if sale_order.status != "Cancelled" and sale_order.docstatus ==1:
                    sale_order.booking_status = "Cancelled"
                    sale_order.cancel()
                
                


        # Check if Vehicle Assignment exists for the order
        if frappe.db.exists("Vehicle Assignment", {"order": doc.name}):
            vehicle_assignment_list = frappe.get_list("Vehicle Assignment", {"order": doc.name})
            
            # Loop through each Vehicle Assignment related to the order
            for vehicle in vehicle_assignment_list:
                va = frappe.get_doc("Vehicle Assignment", vehicle.name)
                if va.assignment_status != "Delivered" and va.assignment_status != "Closed":
                    va.assignment_status = "Cancelled"
                    va.save()
                else:
                    frappe.throw("You will not able to cancel this opportunity, Since the order is already delivered or closed")

            
    if doc.status != "Lost":

        if doc._update_tariff_charges_for_additional_services == 1:
            if doc.transit_charges:
                for add in doc.transit_charges:
                    if add.charges:
                        if frappe.db.exists("Item", add.charges):
                            item = frappe.get_doc("Item", add.charges)
                            if item.item_group == "Additional Services":
                                if frappe.db.exists("Tariff Details", {"customer": doc.party_name}):
                                    tariff = frappe.get_doc("Tariff Details", {"customer": doc.party_name})
                                    
                                    existing_rows = [charge.additional_service for charge in tariff.additional_services]

                                    # Check if the add.charges is already in the existing_rows
                                    if add.charges in existing_rows:
                                        for charge in tariff.additional_services:
                                            if charge.additional_service == add.charges:
                                                cst = float(add.cost) / float(add.quantity)
                                                if cst != charge.rate:
                                                    charge.rate = cst
                                                    charge.amount = cst
                                    else:
                                        cst = float(add.cost) / float(add.quantity)
                                        tariff.append("additional_services", {
                                            "additional_service": add.charges,
                                            "quantity": 1,
                                            "rate": cst,
                                            "amount": cst
                                        })

                                    # Save the changes to the tariff document
                                    tariff.save()
                                else:
                                    frappe.throw("No Tariff added for this customer to update additional service charges")

                
            
        if doc.has_return_trip == 1:
            if not doc.return_trips:
                frappe.throw("Please add return trips")

            if len(doc.receiver_information) < 2:
                frappe.throw("Please add at least one pickup and dropoff in transit details to enable return trips")

            # Check if 'zones' have values in receiver_information
            zones_missing = True
            for entry in doc.receiver_information:
                if entry.zone:
                    zones_missing = False
                    break
            
            if zones_missing:
                frappe.throw("Please add values in the 'zones' field of transit details")

                
        # if doc.lead_id:
            
        #     if doc.booking_type == "Warehousing":
                
        #         for datas in doc.warehouse_space_details:
                
        #             if datas.warehouse == "" or datas.warehouse == None:
        #                 frappe.throw("Please add a warehouse for this customer")
 

    
        if doc.opportunity_from=="Customer":
            
            if doc.lead_id:
                if doc.party_name:
                    # if doc.create_invoices==1:
                        if doc.opportunity_line_item:
                            items_to_include = []
                            for shipment in doc.opportunity_line_item:
                                        if shipment.include_in_billing == 1:
                                            items_to_include.append({
                                                "item_code": shipment.item,
                                                "qty": shipment.quantity,
                                                "rate": shipment.average_rate,
                                                "item_name":shipment.item,
                                                "uom": "Nos",
                                                "description":shipment.item,
                                                "conversion_factor":1

                                            })

                                            # Check if Sales Order with the same booking_id already exists
                                            if not frappe.db.exists("Sales Order", {"booking_id": doc.name}):
                                                # Create a new Sales Order
                                                sales_order = frappe.new_doc("Sales Order")
                                                sales_order.customer = doc.party_name
                                                sales_order.customer_name = doc.customer_name
                                                sales_order.booking_id = doc.name
                                                sales_order.booking_type = doc.booking_type
                                                sales_order.booking_status = "New"
                                                sales_order.delivery_date = frappe.utils.nowdate()
                                                # Append items to the Sales Order
                                                for item_data in items_to_include:
                                                    sales_order.append("items", item_data)
                                                sales_order.save()
                                                sales_order.submit()
                                                doc.status="Converted"
                                                
                                    




                            # Create sales invoice
                            # if doc.payment_amount != 0:
                            #     if not frappe.db.exists("Sales Invoice",{"order_id":doc.name}):
                            #         sales_invoice=frappe.new_doc("Sales Invoice")
                            #         sales_invoice.customer = doc.party_name
                            #         sales_invoice.customer_name = doc.customer_name
                            #         sales_invoice.order_id=doc.name
                            #         sales_invoice.booking_type=doc.booking_type
                            #         #    if  doc.job_number:
                            #         #         sales_invoice.job_number = doc.job_number
                            #         sales_invoice.order_status="New"
                            #         sales_invoice.due_date=frappe.utils.nowdate()
                            #         if doc.booking_type=="Transport" or doc.booking_type=="Warehousing" :
                            #             for shipment in doc.opportunity_line_item:
                            #                 sales_invoice.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
                                    
                            #         if doc.booking_type=="Diesel":    
                            #             sales_invoice.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
                            #         if doc.booking_type=="Packing and Moving":
                            #             for packing in doc.packing_items:
                            #                 sales_invoice.append("items",{"item_code":packing.item_name,"qty":1,"rate":doc.payment_amount})

                            #         sales_invoice.insert()
                            #         #    sales_invoice.submit()
                            #         doc.invoice_id = sales_invoice.name
                        
                            if doc.lead_id:
                                lead= frappe.get_doc ("Lead", doc.lead_id)
                                lead.status = "Converted"
                                lead.save()
                                # doc.create_invoices=0
                        else:
                            frappe.throw("Please add/update Invoice Items in opportunity line items")
            

            if frappe.db.exists("ToDo",{"reference_type":"Opportunity","reference_name":doc.name}):
                todo=frappe.get_doc("ToDo",{"reference_type":"Opportunity","reference_name":doc.name})
                if doc.status=="Converted":
                    todo.status="Closed"
                    todo.save()
            #Create user account for sender
            if doc.mobile_number and doc.email:
                if not doc.booking_channel == "Mobile App":
                    if not frappe.db.exists("User", {"first_name":doc.customer_name, "mobile_no":doc.mobile_number,"email":doc.email}):
                        user = frappe.get_doc(
                            {
                                "doctype": "User",
                                "mobile_no": doc.mobile_number,
                                "user.phone" : doc.mobile_number,
                                "first_name":doc.customer_name,


                                
                                
                                "email":doc.email,
                                "enabled": 1,  
                                "role_profile_name":"Logistic Customer",
                                "user_type": "Website User",
                                "send_welcome_email":0
                            }
                        )
                        user.flags.ignore_permissions = True
                        user.flags.ignore_password_policy = True
                        user.insert()
                        frappe.msgprint('User ' f'<a href="/app/user/{user.name}" target="blank">{user.name} </a> Created Successfully ')

            linked_addresses = frappe.get_all('Dynamic Link', filters={
                'link_doctype': 'Customer',
                'link_name': doc.party_name,
                'parenttype': 'Address'
            }, fields=['parent'])


            # Getting the Address docs and storing them with phone as the key.
            # I'm assuming 'phone' (from info.contact) is the field in the Address DocType that is supposed to be unique.
            existing_addresses = {address_doc.phone: address_doc for address_doc in [frappe.get_doc('Address', address.parent) for address in linked_addresses]}


            for info in doc.receiver_information:
                # Checking if the current info.contact exists as a phone in the existing_addresses
                if info.contact not in existing_addresses:
                
                    if info.address_line1 and info.city:
                        address = frappe.new_doc("Address")
                        if info.name1:
                            address.address_title = info.name1
                        else:
                            address.address_title = "Home"
                        if info.address_line1:
                            address.address_line1 = info.address_line1
                        else:
                            address.address_line1 ="NIL"
                        if info.address_line2:
                            address.address_line2 = info.address_line2
                        else:
                            address.address_line2 = "NIL"
                        if info.city:
                            address.city = info.city
                        else:
                            address.city="NIL"
                        if info.latitude:
                            address.latitude = info.latitude
                        if info.longitude:
                            address.longitude = info.longitude
                        if info.contact:
                            address.phone = info.contact
                        if info.email:
                            address.email_id = info.email
                        if info.make_default ==1:
                            address.is_default=1
                        address.address_type = "Shipping"
                        address.append("links", {
                            "link_doctype": "Customer",
                            "link_name": doc.party_name
                        })
                        address.address_type = "Shipping"
                        
                    
                        address.insert()
                    




                elif info.address and info.make_default == 1:
                    # Fetch the existing default address
                    default_address = frappe.get_all('Address', filters={'is_default': 1, 'phone': info.contact}, fields=['name', 'is_default'])
                    print(default_address)




                    # If there's an existing default address, unset its default status
                    if default_address:
                        address_to_unset = frappe.get_doc('Address', default_address[0].name)
                        address_to_unset.is_default = 0
                        address_to_unset.save()
                    add=frappe.get_doc("Address",info.address)
                    add.address_type = "Shipping"
                    
                    add.append("links", {
                        "link_doctype": "Customer",
                        "link_name": doc.party_name
                    })
                    add.is_default=1
                    add.insert()


            # if doc.booking_type == "Warehousing":
            #     if doc.warehouse_space_details:

            #         for war in doc.warehouse_space_details:
            #             for itm in doc.warehouse_stock_items:
            #                 if war.warehouse:
            #                     warehouses = frappe.get_doc("Warehouse", war.warehouse)
            #                     warehouses.append("warehouse_item",{"booking_id":doc.name,"item":itm.item,"quantity":itm.quantity,"floor_id":war.floor_id,"shelf_id":war.shelf_id,"rack_id":war.rack_id,"zone":war.zone,"status":"Pending"})       
            #                     warehouses.save()


            #                 if doc.party_name:
            #                     customer=frappe.get_doc("Customer",doc.party_name)
            #                     print(customer)
            #                     fromdate=frappe.utils.nowdate()
            #                     dur=int(war.no_of_days)
            #                     todate=add_to_date(fromdate,days=dur,as_string=True)   
            #                     table_len=len(customer.customer_warehouse_details)                           
            #                     if table_len ==0:                               
            #                         customer.append("customer_warehouse_details",{"warehouse":war.warehouse,"from":fromdate,"to":todate})                           
            #                     else:                               
            #                         for warehouses_det in customer.customer_warehouse_details:                                   
            #                             if  war.warehouse not in warehouses_det.warehouse:                                       
            #                                 customer.append("customer_warehouse_details",{"warehouse":war.warehouse,"from":fromdate,"to":todate})                           
            #                     customer.save()
                            
                        




 #API

        
@frappe.whitelist()
def fetch_address(address):
   print(address)
   add=frappe.get_doc("Address",address)
   data={}
   if add.address_title:
       data["title"]=add.address_title
   if add.city:
       data["city"]= add.city
   if add.address_line1:
       data["address1"]=add.address_line1
   if add.address_line2:
       data["address2"]=add.address_line2


   if add.latitude:
       data["lat"]=add.latitude
   if add.longitude:
       data["lon"]=add.longitude
   if add.phone:
       data["phone"]=add.phone
   return data




@frappe.whitelist()
def get_sender_data(mobile_number):
   print(mobile_number)
   if frappe.db.exists("Customer", { "mobile_number": mobile_number}):
       customer = frappe.get_doc("Customer", {"mobile_number": mobile_number})
       return customer.as_dict()
   else:
       pass


@frappe.whitelist()
def get_warehouse(doc):


   if frappe.db.exists("Warehouse", {"customer": doc}):
       warehouses = frappe.get_list("Warehouse", fields=["name"], filters={"customer": doc})
       return [d.name for d in warehouses]
   else:
       return []


      


@frappe.whitelist()
def fetch_warehouse(warehouse):
   print(warehouse)
   data={}
   ware=frappe.get_doc("Warehouse",warehouse)
   if ware.parent_warehouse:
       warehouses=frappe.get_doc("Warehouse",ware.parent_warehouse)
       print(warehouses,"*******")


       if warehouses.city:
           data["city"]= warehouses.city
       if warehouses.address_line_1:
           data["address1"]=warehouses.address_line_1
       if warehouses.address_line_2:
           data["address2"]=warehouses.address_line_2


       if warehouses.latitude:
           data["lat"]=warehouses.latitude
       if warehouses.longitude:
           data["lon"]=warehouses.longitude
       if warehouses.phone_no:
           data["phone"]=warehouses.phone_no
       return data


@frappe.whitelist()
def get_default_address(doc):
   # Fetch linked addresses
   linked_addresses = frappe.get_all('Dynamic Link', filters={
       'link_doctype': 'Customer',
       'link_name': doc,
       'parenttype': 'Address'
   }, fields=['parent'])


   # Fetch Address docs
   addresses = [frappe.get_doc('Address', address.parent) for address in linked_addresses]


   # Find default address
   default_address = None
   for address in addresses:
       if address.is_default == 1:
           default_address = address
           break
   print(default_address)
   if default_address != None:
  
       data={}
       if default_address.name:
           data["name"]=default_address.name
       if default_address.address_title:
           data["title"]=default_address.address_title
       if default_address.city:
           data["city"]= default_address.city
       if default_address.address_line1:
           data["address1"]=default_address.address_line1
       if default_address.address_line2:
           data["address2"]=default_address.address_line2


       if default_address.latitude:
           data["lat"]=default_address.latitude
       if default_address.longitude:
           data["lon"]=default_address.longitude
       if default_address.phone:
           data["phone"]=default_address.phone
       return data










from frappe import whitelist, get_all, get_doc


@frappe.whitelist()
def get_addresses(doc):
   # Fetch linked addresses
   linked_addresses = get_all('Dynamic Link', filters={
       'link_doctype': 'Customer',
       'link_name': doc,
       'parenttype': 'Address'
   }, fields=['parent'])


   # You may only need names of the addresses for the filter
   address_names = [address.parent for address in linked_addresses]
   return address_names




@frappe.whitelist()
def get_end_of_month(current_date_str,booked_upto):
   data={}
   current_date = datetime.strptime(current_date_str, "%Y-%m-%d")
   print(booked_upto,"kkkkk")
   booked_upto_date=datetime.strptime(booked_upto, "%Y-%m-%d")
  
   # Extract year and month from the datetime object
   year = current_date.year
   month = current_date.month
   # Calculate the last day of the month
   _, last_day = calendar.monthrange(year, month)
   # Create a new date object for the end of the month
   end_of_month = current_date.replace(day=last_day)
   if booked_upto_date>end_of_month:
       # Convert the end_of_month back to a string if needed
       end_of_month_str = end_of_month.strftime("%Y-%m-%d")
       data["end_month"]=end_of_month_str
       days_difference = (end_of_month - current_date).days
       data["difference"]=days_difference
       print(end_of_month_str,days_difference)
   else:
       end_of_month_str = end_of_month.strftime("%Y-%m-%d")
       print(end_of_month)
       data["end_month"]=end_of_month_str
       days_difference = (booked_upto_date - current_date).days
       data["difference"]=days_difference
       print(days_difference)
    

   return data


@frappe.whitelist()
def calculate_charges(selected_item, no_of_days, uom, customer, area, rate_month, rate_day,types):
	
    if no_of_days == 0:
        frappe.throw("Please add required no of days. As the current date is same as month end date")
    else:
        no_of_days = float(no_of_days)
            
        data = {}
        if frappe.db.exists("Tariff Details", {"customer": customer}):
            
            tariff = frappe.get_doc("Tariff Details", {"customer": customer})


            if tariff.warehouse_space_rent_charges:
            
                for itm in tariff.warehouse_space_rent_charges:
                    rate=0
                    if types == itm.cargo_type and uom == "Cubic Meter":
                        if rate_month == "1":
                            rate = itm.rate_per_month
                        elif rate_day == "1":
                            if itm.rate_per_day:
                                rate = itm.rate_per_day
                            else:
                                ratemonth= itm.rate_per_month
                                rate=(ratemonth/30)
                                print(rate)


                        total_amount = rate * float(area) if rate_month == 1 else (rate * no_of_days) * float(area)
                        data["total_amount"] = total_amount


                    if uom == itm.uom:
                        if rate_month == "1":
                            rate = itm.rate_per_month
                        elif rate_day == "1":
                            if itm.rate_per_day:
                                rate = itm.rate_per_day
                            else:
                                ratemonth= itm.rate_per_month
                                rate=(ratemonth/30)
                            
                        total_amount = rate * float(area) if rate_month == "1" else (rate * no_of_days) * float(area)
                        data["total_amount"] = total_amount


                return data
            
        else:
            if frappe.db.exists("Tariff Details",{"is_standard":1}):
                tariff=frappe.get_doc("Tariff Details",{"is_standard":1})
                if tariff.warehouse_space_rent_charges:
            
                    for itm in tariff.warehouse_space_rent_charges:
                        rate=0
                        if types == itm.cargo_type and uom == "Cubic Meter":
                            if rate_month == "1":
                                rate = itm.rate_per_month
                            elif rate_day == "1":
                                if itm.rate_per_day:
                                    rate = itm.rate_per_day
                                else:
                                    ratemonth= itm.rate_per_month
                                    rate=(ratemonth/30)
                                    print(rate)


                            total_amount = rate * float(area) if rate_month == 1 else (rate * no_of_days) * float(area)
                            data["total_amount"] = total_amount


                        if uom == itm.uom:
                            if rate_month == "1":
                                rate = itm.rate_per_month
                            elif rate_day == "1":
                                if itm.rate_per_day:
                                    rate = itm.rate_per_day
                                else:
                                    ratemonth= itm.rate_per_month
                                    rate=(ratemonth/30)
                                
                            total_amount = rate * float(area) if rate_month == "1" else (rate * no_of_days) * float(area)
                            data["total_amount"] = total_amount


                    return data
        


  
    
@frappe.whitelist()
def get_warehouse(doc):
   if frappe.db.exists("Warehouse", {"customer": doc}):
       warehouses = frappe.get_list("Warehouse", fields=["name"], filters={"customer": doc})
       return [d.name for d in warehouses]
   else:
       return []




              
    
@frappe.whitelist()
def get_warehouse_data(doc):
   war=frappe.get_doc("Warehouse",doc)
   print(war)
   data={}
   if war.warehouse_floor:
       data["floor"]=war.warehouse_floor
   if war.zone:
       data["zone"]=war.zone
   if war.warehouse_shelf:
       data["shelf"]=war.warehouse_shelf
   if war.warehouse_rack:
       data["rack"]=war.warehouse_rack
   return data





@frappe.whitelist()
def fetch_charges_price(charges):
   print(charges,"@@@@@@@@@@@@@@@@@@@")
   if frappe.db.exists("Item Price",{"item_code":charges}):
       itm=frappe.get_doc("Item Price",{"item_code":charges})
       print(itm)
       return itm.as_dict()

@frappe.whitelist()
def get_return_order(name):
    print(name)
    data ={}
    if frappe.db.exists("Opportunity",name):
        oppo=frappe.get_doc("Opportunity",name)
        print(oppo)
        if oppo.receiver_information:
            for details in oppo.receiver_information:
                if details.zone:
                    data["last_zone"]=details.zone 
                if details.transit_type:
                    data["last_transit_type"]= details.transit_type
                if details.latitude:
                    data["latitude"]=details.latitude
                if details.longitude:
                    data["longitude"] = details.longitude
                if details.address_line1:
                    data["line1"] = details.address_line1
                if details.address_line1:
                    data["line2"] = details.address_line1
                if details.city:
                    data["city"] = details.city
                print(data)
            return data



            

    return 
get_return_order

import json
@frappe.whitelist()
def calculate_transportation_cost(customer, zone, vehicle_type,booking_type):
    zone_list = json.loads(zone)
    amount = 0
    data = {}
    if booking_type:
        if frappe.db.exists("Booking Type",booking_type):
            b_type = frappe.get_doc("Booking Type",booking_type)
            if b_type.item :
                data["bill_item"] = b_type.item
    # if len(zone_list) != 2:
    #     return 0  # Return 0 if it's not a pair

    if frappe.db.exists("Tariff Details", {"customer": customer}):
        tariff = frappe.get_doc("Tariff Details", {"customer": customer})


        for item in tariff.tariff_details_item:
            if item.from_city == zone_list[0] and item.to_city == zone_list[1] and item.vehicle_type == vehicle_type:
                data["amount"] = item.amount
            elif item.from_city == zone_list[1] and item.to_city == zone_list[0] and item.vehicle_type == vehicle_type:
                data["amount"]= item.amount    
    else:
        if frappe.db.exists("Tariff Details", {"is_standard": 1}):
            tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
            for item in tariff.tariff_details_item:
                if item.from_city == zone_list[0] and item.to_city == zone_list[1] and item.vehicle_type == vehicle_type:
                    data["amount" ]= item.amount
                elif item.from_city == zone_list[1] and item.to_city == zone_list[0] and item.vehicle_type == vehicle_type:
                   data[ "amount" ]= item.amount
    return data  





@frappe.whitelist()
def create_stock_entry(doc):
   print(doc)
   opp=frappe.get_doc("Opportunity",doc)
  
  
   for stock in opp.warehouse_stock_items:
       if stock.movement_type=="Stock IN":
           stock_entry = frappe.new_doc('Stock Entry')
           stock_entry.party_name=opp.party_name
           stock_entry.order_id=opp.name
           stock_entry.stock_entry_type="Material Receipt"
           stock_entry.purpose="Material Receipt"
           for war in opp.warehouse_space_details:
               stock_entry.append("items",{"t_warehouse":war.warehouse,
                           "item_code":stock.item,"qty":stock.quantity,
                           "allow_zero_valuation_rate":1
      
               })
          
          
           opp.order_status="Stock Updated"
           stock_entry.save(ignore_permissions=True)
           stock_entry.submit()
           opp.save()
           frappe.msgprint("Stock Updated Successfully")

      
   return "success"




@frappe.whitelist()
def get_rate(itm, qty, customer):
    print(itm)
    data = {}

    if frappe.db.exists("Tariff Details", {"customer": customer}):
        tariff = frappe.get_doc("Tariff Details", {"customer": customer})
        if tariff.additional_services:
            for add in tariff.additional_services:
                if itm == add.additional_service:
                    print(add.rate)
                    data["rate"] = add.rate
                    amount = int(qty) * add.rate
                    data["amount"] = amount
                
        else:
            if frappe.db.exists("Tariff Details", {"is_standard": 1}):
                tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
                if tariff.additional_services:
                    for add in tariff.additional_services:
                        if itm == add.additional_service:
                            print(add.rate)
                            data["rate"] = add.rate
                            amount = int(qty) * add.rate
                            data["amount"] = amount

    else:
        if frappe.db.exists("Tariff Details", {"is_standard": 1}):
            tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
            if tariff.additional_services:
                for add in tariff.additional_services:
                    if itm == add.additional_service:
                        print(add.rate)
                        data["rate"] = add.rate
                        amount = int(qty) * add.rate
                        data["amount"] = amount

    return data

                      
             
    

@frappe.whitelist()
def get_invoice_items(doc):
    oppo = frappe.get_doc("Opportunity", doc)
    data_from_receipt = []
    if oppo.order_status != "Cancelled":

        pending_items_exist = False  # Flag to check if there are pending items

        if oppo.opportunity_line_item:
            for line in oppo.opportunity_line_item:
                if line.status == "Order" or line.include_in_billing == 1:
                    data = {}  # Create a new dictionary for each iteration

                    data["b_type"] = oppo.booking_type
                    if oppo.job_number:
                        data["job"] = oppo.job_number
                    else:
                        data["job"] = ""
                    data["party"] = oppo.party_name
                    data["item"] = line.item

                    if frappe.db.exists("Item", line.item):
                        it = frappe.get_doc("Item", line.item)
                        if it.stock_uom:
                            data["uom"] = it.stock_uom
                        if it.description:
                            data["description"] = it.description
                        if oppo.company:
                            comp = frappe.get_doc("Company", oppo.company)
                            if comp.default_income_account:
                                data["account"] = comp.default_income_account

                    data["quantity"] = line.quantity
                    data["rate"] = line.average_rate
                    data_from_receipt.append(data)
                    pending_items_exist = True  # Set the flag to True

        if not pending_items_exist:
            frappe.msgprint("No pending items found in the opportunity.")  # Display a message or take appropriate action
            return {"data": []}

        return {"data": data_from_receipt}
    else:
        frappe.throw("The order is already cancelled. You will not able to create a sales invoice against a cancelled order")


          
@frappe.whitelist()
def  get_payment_items(doc):
   print(doc)
   oppo=frappe.get_doc("Opportunity",doc)


   data_from_receipt = []
   data = {}
  
   data["b_type"]=oppo.booking_type
   data["party"]=oppo.party_name
   data["cus"]=oppo.customer_name
   data["channel"]=oppo.booking_channel
   data["mode"]=oppo.mode_of_payment
   if oppo.company:
       company=frappe.get_doc("Company",oppo.company)
       data["paid_from"]=company.default_receivable_account
       data["paid_to"]=company.default_cash_account
       data["paid_to_account_currency"]=company.default_currency
       data["paid_from_account_currency"]=company.default_currency
   current_date=frappe.utils.nowdate()        
   data["reference_date"]=current_date
   data["total_allocated_amount"]=oppo.payment_amount
   data["invoice"]=oppo.invoice_id
   data_from_receipt.append(data)
   print(data_from_receipt)
   return {"data": data_from_receipt}


@frappe.whitelist()
def cancellation_charges(name,cost,zero_cost):
    
    print(name,cost,zero_cost)
   
    if cost and zero_cost == "0":
        doc=frappe.get_doc("Opportunity",name)
        sales_invoice=frappe.new_doc("Sales Invoice")
        sales_invoice.customer = doc.party_name
        sales_invoice.customer_name = doc.customer_name
        sales_invoice.order_id=doc.name
        sales_invoice.booking_type=doc.booking_type

        sales_invoice.order_status=doc.order_status
        sales_invoice.due_date=frappe.utils.nowdate()
    
    
        sales_invoice.append("items",{"item_code":"Cancellation Charges","qty":1,"rate": cost})
        sales_invoice.save()
        sales_invoice.submit()
        print(sales_invoice)
       
        return sales_invoice.name
        





from frappe import _

@frappe.whitelist()
def cancel_booking(name):
# frappe.throw("hi")
    if frappe.db.exists("Opportunity", name):
        opportunity = frappe.get_doc("Opportunity", name)
        print(opportunity,"@@@")


        # Find the Route Details Items with the specified opportunity ID
        route_details_items = frappe.get_all(
        "Route Details Item",
        filters={"order_id": opportunity.name},
        fields=["parent"]
        )


        # Extract the parent document names (Vehicle Assignment)
        vehicle_assignment_names = {item["parent"] for item in route_details_items}


        # Convert the set back to a list if needed
        vehicle_assignment_names = list(vehicle_assignment_names)
        if len(vehicle_assignment_names)>0:
        # for i in vehicle_assignment_names:
        # if frappe.db.exists("Vehicle Assignment",i.name):
        # veh_ass=frappe.get_doc("Vehicle Assignment",i.name)
            print(vehicle_assignment_names,"333")
            return vehicle_assignment_names


        else:
            print("kk")
            return None


@frappe.whitelist()
def get_zones(order_id):
    data = {}
    oppo = frappe.get_doc("Opportunity", order_id)
    if oppo.party_name:
        customer = frappe.get_doc("Customer",oppo.party_name)
        if customer.address_line1 != "NIL":
            data["line1"] = customer.address_line1
        else:
            data["line1"] = ""
        if customer.city != "NIL":
            data["city"] = customer.city
        else:
            data["city"] = ""
        if customer.mobile_number:
            data["mobile"] = customer.mobile_number
    
    if oppo and oppo.receiver_information:
        data["from"]=(oppo.receiver_information[0].zone)  
        from_loc = oppo.receiver_information[0].zone
        location = frappe.get_doc("Location",from_loc)
        print(location.latitude,location)
        if location.latitude:
            data["lat"] = location.latitude
        if location.longitude:
            data["long"] = location.longitude
        
        if len(oppo.receiver_information) > 1:
            data ["to"] = (oppo.receiver_information[-1].zone) 
    
    return data

             
         
     