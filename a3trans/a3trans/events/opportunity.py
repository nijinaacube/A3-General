import frappe
from datetime import date
from datetime import date
from datetime import datetime
import calendar
from functools import reduce
from frappe.utils import add_to_date
def after_insert(doc, methods):
  
    if doc.lead_id == "" or doc.lead_id == None:
            
        if doc.party_name:
                if doc.create_invoices==1:
                    if doc.opportunity_line_item:
                
                        #Create sales order
                        if not frappe.db.exists("Sales Order",{"booking_id":doc.name}):
                            sales_order=frappe.new_doc("Sales Order")
                            sales_order.customer = doc.party_name
                            sales_order.customer_name = doc.customer_name  
                            sales_order.booking_id=doc.name
                            sales_order.booking_type=doc.booking_type
                            sales_order.booking_status="New"
                            sales_order.delivery_date = frappe.utils.nowdate()
                            if doc.booking_type=="Transport" or doc.booking_type=="Warehousing" :
                                if doc.opportunity_line_item:
                                        for shipment in doc.opportunity_line_item:
                                            sales_order.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
                                        sales_order.save()
                                        sales_order.submit()
                




                        # Create sales invoice
                        if doc.payment_amount != 0:
                            if not frappe.db.exists("Sales Invoice",{"order_id":doc.name}):
                                sales_invoice=frappe.new_doc("Sales Invoice")
                                sales_invoice.customer = doc.party_name
                                sales_invoice.customer_name = doc.customer_name
                                sales_invoice.order_id=doc.name
                                sales_invoice.booking_type=doc.booking_type
                                #    if  doc.job_number:
                                #         sales_invoice.job_number = doc.job_number
                                sales_invoice.order_status="New"
                                sales_invoice.due_date=frappe.utils.nowdate()
                                if doc.booking_type=="Transport" or doc.booking_type=="Warehousing" :
                                    for shipment in doc.opportunity_line_item:
                                        sales_invoice.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
                                
                                if doc.booking_type=="Diesel":
                                    
                                    sales_invoice.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
                                if doc.booking_type=="Packing and Moving":
                                    for packing in doc.packing_items:
                                        sales_invoice.append("items",{"item_code":packing.item_name,"qty":1,"rate":doc.payment_amount})

                                sales_invoice.insert()
                                #    sales_invoice.submit()
                                doc.invoice_id = sales_invoice.name
                            doc.status="Converted"
                            doc.create_invoices=0
                        else:
                            frappe.throw("Please add/update Invoice Items in opportunity line items")

     
    if doc.lead_id:
        lead_doc = frappe.get_doc("Lead", doc.lead_id)
        print(lead_doc.status, doc.status, lead_doc.contact_by)

        # Check if 'contact_by' is available and valid
        if lead_doc.contact_by:
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
            # frappe.throw("ll")
            print(lead_doc, "##################")
            print(lead_doc.status, doc.status, lead_doc.contact_by)

            todo = frappe.new_doc("ToDo")
            todo.date = lead_doc.ends_on
            todo.owner = lead_doc.contact_by
            todo.description = "Please follow-up and complete the booking"
            todo.reference_type = "Opportunity"
            todo.reference_name = doc.name

            todo.save()
            frappe.msgprint(f"Opportunity {doc.name} assigned to {lead_doc.contact_by}")
        else:
            frappe.msgprint("Error: 'contact_by' not found or is empty in the Lead.")
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

def validate(doc,method):
    if doc.lead_id:
        
        if doc.booking_type == "Warehousing":
            
            for datas in doc.warehouse_space_details:
              
                if datas.warehouse == "" or datas.warehouse == None:
                    frappe.throw("Please add a warehouse for this customer")
    if doc.status == "Lost":
        doc.order_status = "Cancelled"
        print(doc.order_lost_reason,"*******************************8")
   
    if doc.opportunity_from=="Customer":
        if doc.lead_id:
            if doc.party_name:
                if doc.create_invoices==1:
                    if doc.opportunity_line_item:
                        
                
                        #Create sales order
                        if not frappe.db.exists("Sales Order",{"booking_id":doc.name}):
                            sales_order=frappe.new_doc("Sales Order")
                            sales_order.customer = doc.party_name
                            sales_order.customer_name = doc.customer_name  
                            sales_order.booking_id=doc.name
                            sales_order.booking_type=doc.booking_type
                            sales_order.booking_status="New"
                            sales_order.delivery_date = frappe.utils.nowdate()
                            if doc.booking_type=="Transport" or doc.booking_type=="Warehousing" :
                                if doc.opportunity_line_item:
                                        for shipment in doc.opportunity_line_item:
                                            sales_order.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
                                        sales_order.save()
                                        sales_order.submit()
                    




                        # Create sales invoice
                        if doc.payment_amount != 0:
                            if not frappe.db.exists("Sales Invoice",{"order_id":doc.name}):
                                sales_invoice=frappe.new_doc("Sales Invoice")
                                sales_invoice.customer = doc.party_name
                                sales_invoice.customer_name = doc.customer_name
                                sales_invoice.order_id=doc.name
                                sales_invoice.booking_type=doc.booking_type
                                #    if  doc.job_number:
                                #         sales_invoice.job_number = doc.job_number
                                sales_invoice.order_status="New"
                                sales_invoice.due_date=frappe.utils.nowdate()
                                if doc.booking_type=="Transport" or doc.booking_type=="Warehousing" :
                                    for shipment in doc.opportunity_line_item:
                                        sales_invoice.append("items",{"item_code":shipment.item,"qty":shipment.quantity,"rate":shipment.average_rate})
                                
                                if doc.booking_type=="Diesel":
                                    
                                    sales_invoice.append("items",{"item_code":"Diesel","qty":1,"rate":doc.payment_amount})
                                if doc.booking_type=="Packing and Moving":
                                    for packing in doc.packing_items:
                                        sales_invoice.append("items",{"item_code":packing.item_name,"qty":1,"rate":doc.payment_amount})

                                sales_invoice.insert()
                                #    sales_invoice.submit()
                                doc.invoice_id = sales_invoice.name
                            doc.status="Converted"
                            if doc.lead_id:
                                lead= frappe.get_doc ("Lead", doc.lead_id)
                                lead.status = "Converted"
                                lead.save()
                            doc.create_invoices=0
                    else:
                        frappe.throw("Please add/update Invoice Items in opportunity line items")
        

        if frappe.db.exists("ToDo",{"reference_type":"Opportunity","reference_name":doc.name}):
            todo=frappe.get_doc("ToDo",{"reference_type":"Opportunity","reference_name":doc.name})
            if doc.status=="Converted":
                todo.status="Closed"
                todo.save()
        #Create user account for sender
        if doc.mobile_number and doc.email:
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
   print(charges)
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
def calculate_transportation_cost(customer, zone, vehicle_type, length):
    zone_list = json.loads(zone)
    amount = 0


    if len(zone_list) != 2:
        return 0  # Return 0 if it's not a pair


    if frappe.db.exists("Tariff Details", {"customer": customer}):
        tariff = frappe.get_doc("Tariff Details", {"customer": customer})


        for item in tariff.tariff_details_item:
            if item.from_city == zone_list[0] and item.to_city == zone_list[1] and item.vehicle_type == vehicle_type:
                amount = item.amount
            elif item.from_city == zone_list[1] and item.to_city == zone_list[0] and item.vehicle_type == vehicle_type:
                amount = item.amount


        
    else:
        if frappe.db.exists("Tariff Details", {"is_standard": 1}):
            tariff = frappe.get_doc("Tariff Details", {"is_standard": 1})
            for item in tariff.tariff_details_item:
                if item.from_city == zone_list[0] and item.to_city == zone_list[1] and item.vehicle_type == vehicle_type:
                    amount = item.amount
                elif item.from_city == zone_list[1] and item.to_city == zone_list[0] and item.vehicle_type == vehicle_type:
                    amount = item.amount
    return amount  
    #    customer=frappe.get_doc("Customer",customer)
    #    if customer.tariff:
    #        tariff = frappe.get_doc("Tariff Details", customer.tariff)
    #        for item in tariff.tariff_details_item:
    #             if item.from_city == zone_list[0] and item.to_city == zone_list[1] and item.vehicle_type == vehicle_type:
    #                amount = item.amount
    #             elif item.from_city == zone_list[1] and item.to_city == zone_list[0] and item.vehicle_type == vehicle_type:
    #                 amount = item.amount


   




      






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


          
       # if stock.movement_type=="Stock OUT":
       #   delivery_note=frappe.new_doc('Delivery Note')
       #   delivery_note.customer=opp.party_name
       #   delivery_note


       #   stock_entry.stock_entry_type="Material Issue"
       #   stock_entry.purpose="Material Issue"
       #   for war in opp.warehouse_space_details:
       #       stock_entry.append("items",{"s_warehouse":war.warehouse,
       #                   "item_code":stock.item,"qty":stock.quantity,
       #                   "allow_zero_valuation_rate":1
      
       #       })
      
  
      
   return "success"







@frappe.whitelist()
def get_invoice_items(doc):
    oppo = frappe.get_doc("Opportunity", doc)
    data_from_receipt = []
    
    if oppo.opportunity_line_item:
        for line in oppo.opportunity_line_item:
            data = {}
            data["b_type"] = oppo.booking_type
            if oppo.job_number:
                data["job"]=oppo.job_number
            else:
                data["job"]=""
            data["party"] = oppo.party_name
            data["item"] = line.item
            data["quantity"] = line.quantity
            data["rate"] = line.average_rate
            data_from_receipt.append(data)
        
    return {"data": data_from_receipt}


          
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
            return vehicle_assignment_names


        else:
            return None


