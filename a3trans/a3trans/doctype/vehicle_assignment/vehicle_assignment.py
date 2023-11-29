# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
import math
from frappe.utils import get_datetime, time_diff


class VehicleAssignment(Document):
    def after_insert(self):
        if self.order and self.type_of_vehicles:
            tp = self.type_of_vehicles

            opportunity = frappe.get_doc("Opportunity", self.order)

            if tp:
                    # found = False
                    # for data in opportunity.vehicle_details_item:
                    #     if data.vehicle_type == tp:
                    #         data.vehicle_number = self.vehicle_id
                    #         data.vehicle_assignment = self.name
                    #         found = True
                    #         break
                    # if not found:
                opportunity.multiple_vehicles = 1
                opportunity.append("vehicle_details_item", {
                    "vehicle_type": tp,
                    "vehicle_number": self.vehicle_id,
                    "vehicle_assignment": self.name
                })

            opportunity.save()

        
        


                  

    def validate(self):  

        if self.driver_id:
            driver=frappe.get_doc("Staff Member",self.driver_id)
            if driver.status=="Available":
                driver.status="On Duty"
                driver.save()
        if self.helper_id:
            helper=frappe.get_doc("Staff Member",self.helper_id)
            if helper.status=="Available":
                helper.status="On Duty"
                helper.save()
        if self.vehicle_id:
            vehicle=frappe.get_doc("Vehicle",self.vehicle_id)
            if vehicle.vehicle_status=="Available":
                vehicle.vehicle_status="On Duty"
                vehicle.save()


        if self.routes:
            for order in self.routes:
                if self.vehicle_id:
                    vehicle=frappe.get_doc("Vehicle",self.vehicle_id)
                    vehicle.last_location_of_vehicle_assignment = order.zone
                    vehicle.save()

                if order.order_id:
                    opportunity = frappe.get_doc("Opportunity", order.order_id)
                    if self.vehicle_id:
                        opportunity.vehicle=self.vehicle_id
                    if self.make:
                        opportunity.make=self.make
                    if self.model:
                        opportunity.model=self.model
                    if self.driver_id:
                        opportunity.driver=self.driver_id
                    if self.driver_name:
                        opportunity.driver_name=self.driver_name
                    if self.mobile_number:
                        opportunity.driver_phone_number=self.mobile_number
                    if self.helper_id:
                        opportunity.helper=self.helper_id
                    if self.helper_name:
                        opportunity.helper_name=self.helper_name
                    if self.phone_number:
                        opportunity.helper_phone_number=self.phone_number
                   
                    # if self.vehicle_id:
                    #   vehicle=frappe.get_doc("Vehicle",self.vehicle_id)
                    #   for type in vehicle.allowed_booking_type:
                    #       if opportunity.booking_type in  type.booking_type:
                    #           pass
                    #       else:
                    #           frappe.throw("You are not allowed to choose the vehicle for this booking.")
                    # if frappe.db.exists("Sales Order", {"booking_id": opportunity.name}):
                    # sales_order = frappe.get_doc("Sales Order", {"booking_id": opportunity.name})
                    # # if frappe.db.exists("Sales Invoice", {"order_id": opportunity.name}):
                    # sales_invoice = frappe.get_doc("Sales Invoice", {"order_id": opportunity.name})
                    
                    if self.assignment_status == "Vehicle Assigned":
                        opportunity.order_status = "Vehicle Assigned"
                        opportunity.status = "Converted"
                      
                    elif self.assignment_status == "In-Transit":
                        opportunity.order_status = "In-Transit"
                        # vehicle_log = frappe.new_doc ("Vehicle Log")
                        # vehicle_log.license_plate = self.vehicle_id
                        # if self.driver_id:
                        #     staff = frappe.get_doc("Staff Member",self.driver_id)
                        #     employee =frappe.get_doc("Employee",staff.employee)
                        #     vehicle_log.employee =employee.name
                       
                    elif self.assignment_status == "Arrived":
                        opportunity.order_status = "Arrived"
                       
                    elif self.assignment_status == "Delivered":
                        opportunity.order_status = "Delivered"
                       
                        
                    elif self.assignment_status == "Delivered":
                        if self.driver_id:
                            driver=frappe.get_doc("Staff Member",self.driver_id)
                            driver.status="Available"  
                            driver.save()
                        if self.helper_id:
                            helper=frappe.get_doc("Staff Member",self.helper_id)
                            helper.status="Available"
                            helper.save()
                        if self.vehicle_id:
                            vehicle=frappe.get_doc("Vehicle",self.vehicle_id)
                            vehicle.vehicle_status="Available"
                            vehicle.last_location_of_vehicle_assignment = ""
                            vehicle.save()
                        opportunity.order_status = "Delivered"
                      
                    opportunity.status="Converted"
                    opportunity.db_update()
                    frappe.db.commit()
                 


                if order.status=="Arrived":
                    order.actual_arrival_time=frappe.utils.now()




                if order.status=="Completed":
                    order.completed_date=frappe.utils.nowdate()
                    completed_times=frappe.utils.now_datetime()
                    order.completed_time = completed_times.strftime('%H:%M:%S')
                    if order.latitude and order.longitude and order.current_latitude and order.current_longitude:
                        order.latitude=float(order.latitude)
                        order.longitude=float(order.longitude)
                        order.current_latitude=float(order.current_latitude)
                        order.current_longitude=float(order.current_longitude)
                        lat1 = math.radians(order.latitude)
                        lon1 = math.radians(order.longitude)
                        lat2 = math.radians(order.current_latitude)
                        lon2 = math.radians(order.current_longitude)



                        # Radius of the Earth in kilometers
                        earth_radius_km = 6371.0

                        # Haversine formula
                        dlon = lon2 - lon1
                        dlat = lat2 - lat1

                        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
                        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                        # Calculate the distance
                        distance_km =round(earth_radius_km * c,2)
                        order.distance=distance_km
                        if order.eta and order.actual_arrival_time:
                            start_datetime = get_datetime(order.eta)
                            end_datetime = get_datetime(order.actual_arrival_time)


                            # Calculate the time difference
                            time_difference = time_diff(end_datetime, start_datetime)


                            # Calculate the total difference in minutes
                            total_minutes = (
                            time_difference.days * 24 * 60 + # Days to minutes
                            time_difference.seconds // 60 # Seconds to minutes
                            )

                            print("minutes",total_minutes)
                            order.time_difference=float(total_minutes)



   # def after_insert(self):
   #   if self.routes:
   #       for order in self.routes:
            #  if order.order_id:
            #      opportunity = frappe.get_doc("Opportunity", order.order_id)
   #               if self.vehicle_id:
   #                   opportunity.vehicle=self.vehicle_id
   #               if self.make:
   #                   opportunity.make=self.make
   #               if self.model:
   #                   opportunity.model=self.model
   #               if self.driver_id:
   #                   opportunity.driver=self.driver_id
   #               if self.driver_name:
   #                   opportunity.driver_name=self.driver_name
   #               if self.mobile_number:
   #                   opportunity.driver_phone_number=self.mobile_number
   #               if self.helper_id:
   #                   opportunity.helper=self.helper_id
   #               if self.helper_name:
   #                   opportunity.helper_name=self.helper_name
   #               if self.phone_number:
   #                   opportunity.helper_phone_number=self.phone_number
   #               opportunity.save()




#API
@frappe.whitelist()
def get_staff_data(vehicle_id):
   print(vehicle_id)
   if frappe.db.exists("Vehicle", vehicle_id):
       vehicle = frappe.get_doc("Vehicle", vehicle_id)
      
       return vehicle.as_dict()
   else:
       pass
   
@frappe.whitelist()
def fetch_order_details(order_id):
    if order_id:
        opportunity = frappe.get_doc("Opportunity", order_id)
        if opportunity.booking_type != "Transport" and opportunity.required_transit == 0:
            frappe.throw("Please choose an Order that needs transportation")
        # if opportunity.order_status == "Vehicle Assigned":
        #     frappe.throw("Please check the order. The order is already assigned in another trip ")
        if opportunity.status == "Closed":
            frappe.throw("Plese Check. You are choosing a closed opportunity")
        data1 = []
        data2 = []
        data3 = []
        data = {}
        if opportunity.vehicle_details_item:
            for vehicle in opportunity.vehicle_details_item:
                if vehicle.vehicle_type:
                    data3.append({"vtype": vehicle.vehicle_type,})
    
            data["data3"] = data3


        for item in opportunity.receiver_information:
           
                
            data1.append({
                "order_no": item.order_no,
                "type": item.transit_type,
                "zone": item.zone,
                "lat": item.latitude,
                "lon": item.longitude,
                "remark": item.remarks,
            })
    
            data["data1"] = data1

        if opportunity.has_return_trip == 1:
            if opportunity.return_trips:
                for trip in opportunity.return_trips:
                    
                        data2.append({
                            "trip_order_no": trip.order_no,
                            "trip_type": trip.transit_type,
                            "trip_zone": trip.zone,
                            "trip_lat": trip.latitude,
                            "trip_lon": trip.longitude,
                            "trip_remark": trip.remarks,
                        })

            data["data2"] = data2
            data["has_trip"] = opportunity.has_return_trip
        if opportunity.is_return ==1:
            data["is_return"] =1
        
        return data



