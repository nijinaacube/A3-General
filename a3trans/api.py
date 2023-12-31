import frappe, json
import random
from frappe import _
from frappe.auth import clear_cookies
from frappe.exceptions import ValidationError
from frappe.utils.pdf import get_pdf
from frappe.utils import cint
from datetime import datetime, timedelta
from frappe.sessions import clear_sessions, delete_session


@frappe.whitelist(allow_guest=True)
def get(mobile_no=None):
    data = {}
    message = ""
    status_code = 0
    valid = True
    def generate_otp():
        # otp = ''.join(["{}".format(random.randint(0, 9)) for i in range(0, otp_length)])
        otp = '123456'
        return {"id": key, "otp": otp, "timestamp": str(frappe.utils.get_datetime().utcnow())}

    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            data = 'Please enter your mobile number'
            message = "Mobile Number not found"
            status_code = 420
            valid = False
           

    u = frappe.db.get_value("User", {"mobile_no": mobile_no}, "name")

    if not u:
        data = 'User with this number is not found'
        message = "User not found"
        status_code = 500
        valid = False

    key = mobile_no + "_otp"
    otp_length = 6  # 6 digit OTP
    rs = frappe.cache()

    if rs.get_value(key) and otp_not_expired(rs.get_value(key)):  # check if an otp is already being generated
        otp_json = rs.get_value(key)
    else:
        otp_json = generate_otp()
        rs.set_value(key, otp_json)

    """
    FIRE SMS FOR OTP
        "{0} is your OTP for AgriNext. Do not share OTP with anybody. Thanks.".format(otp_json.get("otp"))
    """
    # sms_settings = frappe.get_single("SMS Settings")
    # apikey = ""
    # sender = ""
    # otp = otp_json.get("otp")
    # for params in sms_settings.parameters:
    #     if params.parameter == "apikey":
    #         apikey = params.value
    #     elif params.parameter == "sender":
    #         sender = params.value

    # re = requests.post(sms_settings.sms_gateway_url, data={
    #     "apikey":apikey,
    #     "sender": sender,
    #     "numbers": mobile_no,
    #     "message": f"KEMDEL UPDATES: Click on the link to initiate payment for your order no: {otp} - SN83. For more info: www.google.com - COFBA NETWORKS"
    # })

    # return otp_json.get("otp")  # MUST DISABLE IN PRODUCTION!!
    if(valid):
        
        out = {
            "OTPGENERATED":otp_json.get("otp"),
            }
    else:
        frappe.throw(data, title=message, exc=LookupError)
    frappe.local.response = frappe._dict(out)


@frappe.whitelist(allow_guest=True)
def get_for_signup(mobile_no=None, first_name=None, last_name=None, email=None, company=None, landline=None, company_address=None):
    data = {}
    message = ""
    status_code = 0
    valid = True
    def generate_otp_for_signup():
        # otp = ''.join(["{}".format(random.randint(0, 9)) for i in range(0, otp_length)])
        otp = '123456'
        return {"id": key, "otp": otp, "timestamp": str(frappe.utils.get_datetime().utcnow())}

    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            data = 'Please enter your mobile number'
            message = "Mobile Number not provided"
            status_code = 420
            valid = False
           
    if not first_name:
        first_name = frappe.form_dict.get("first_name")
        if not first_name:
            data = 'Please enter your first name'
            message = "First name not provided"
            status_code = 420
            valid = False
            
    if not last_name:
        last_name = frappe.form_dict.get("last_name")
        if not last_name:
            data = 'Please enter your last name'
            message = "Last name not provided"
            status_code = 420
            valid = False

    if not email:
        email = frappe.form_dict.get("email")
        if not email:
            data = 'Please enter your email'
            message = "Email not provided"
            status_code = 420
            valid = False

    u = frappe.db.get_value("User", {"mobile_no": mobile_no}, "name")

    if u:
        data = 'Mobile Number you have entered already exists'
        message = "Mobile Number already exists"
        status_code = 421
        valid = False
        
    u2 = frappe.db.get_value("User", {"email": email}, "name")
    if u2:
        data = 'Email address you have entered already exists'
        message = "Email address already exists"
        status_code = 422
        valid = False
        

    key = mobile_no + "_otp"
    otp_length = 6  # 6 digit OTP
    rs = frappe.cache()

    if rs.get_value(key) and otp_not_expired(rs.get_value(key)):  # check if an otp is already being generated
        otp_json = rs.get_value(key)
    else:
        otp_json = generate_otp_for_signup()
        rs.set_value(key, otp_json)
    rs.set_value(mobile_no + "_firstname", first_name)
    rs.set_value(mobile_no + "_lastname", last_name)
    rs.set_value(mobile_no + "_email", email)
    rs.set_value(mobile_no + "_landline", landline)
    rs.set_value(mobile_no + "_company", company)
    rs.set_value(mobile_no + "_companyAddress", company_address)

    """
    FIRE SMS FOR OTP
        "{0} is your OTP for AgriNext. Do not share OTP with anybody. Thanks.".format(otp_json.get("otp"))
    """
    
    if valid:
        out = {
            "OTPGENERATED":otp_json.get("otp"),
            }
    else:
        frappe.throw(data, title=message, exc=ValidationError)
    
    frappe.local.response = frappe._dict(out)


@frappe.whitelist(allow_guest=True)
def authenticate(otp=None, mobile_no=None, client_id=None):
    data = {}
    message = ""
    status_code = 0
    valid = True
    if not otp:
        otp = frappe.form_dict.get("otp")
        if not otp:
            data = 'You have not entered OTP'
            message = "OTP not found"
            status_code = 420
            valid = False
           
    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            data = 'You have not entered Mobile number'
            message = "Mobile number not found"
            status_code = 420
            valid = False
            
    if not client_id:
        client_id = frappe.form_dict.get("client_id")
        if not client_id:
            data = 'Client ID is not provided'
            message = "Client ID not found"
            status_code = 420
            valid = False

    rs = frappe.cache()
    otp_json = rs.get_value("{0}_otp".format(mobile_no))

    if otp_json.get("otp") != otp:
        data = 'OTP you have entered is not found'
        message = "OTP not found"
        status_code = 420
        valid = False

    if not otp_not_expired(otp_json):
        data = 'You have entered expired OTP'
        message = "OTP is expired"
        status_code = 420
        valid = False

    otoken = create_bearer_token(mobile_no, client_id)
    user_roles = frappe.get_roles(otoken.user)
    
    if(valid):
        out = {
            "access_token": otoken.access_token,
            "refresh_token": otoken.refresh_token,
            "expires_in": otoken.expires_in,
            "scope": otoken.scopes,
            "user_details": {
                "user": otoken.user,
                "full_name": frappe.get_value('User', otoken.user, "full_name"),
                "roles": user_roles,
                "mobile": mobile_no,
                "user_type": frappe.get_value("User", otoken.user, "user_type")
            }
        }
    else:
        frappe.throw(data, title=message, exc=ValidationError)

    # Delete consumed otp
    rs.delete_key(mobile_no + "_otp")

    frappe.local.response = frappe._dict(out)

@frappe.whitelist(allow_guest=True)
def authenticate_for_signup(otp=None, mobile_no=None, client_id=None):
    data = {}
    message = ""
    status_code = 0
    valid = True
    if not otp:
        otp = frappe.form_dict.get("otp")
        if not otp:
            data = "You have not entered OTP"
            message = "OTP not found"
            status_code = 420
            valid = False

    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            data = "You have not entered Mobile number"
            message = "Mobile number not found"
            status_code = 420
            valid = False

    if not client_id:
        client_id = frappe.form_dict.get("client_id")
        if not client_id:
            data = "Client ID is not provided"
            message = "Client ID not found"
            status_code = 420
            valid = False

    rs = frappe.cache()
    otp_json = rs.get_value("{0}_otp".format(mobile_no))

    if int(otp_json['otp']) != int(otp):
        data = "OTP you have entered is not found"
        message = "OTP not found"
        status_code = 420
        valid = False
    else:
        valid = True

    # if not otp_not_expired(otp_json):
    #     data = "You have entered expired OTP"
    #     message = "OTP is expired"
    #     status_code = 420
    #     valid = False

    
    if valid:
        
        user = frappe.get_doc(
            {
                "doctype": "User",
                "mobile_no": mobile_no,
                "phone" : rs.get_value("{0}_landline".format(mobile_no)),
                "first_name":rs.get_value("{0}_firstname".format(mobile_no)), 
                "last_name":rs.get_value("{0}_lastname".format(mobile_no)), 
                "email":rs.get_value("{0}_email".format(mobile_no)),
                "enabled": 1,  
                "role_profile_name":"Logistic Customer",
                "user_type": "Website User",
                "send_welcome_email":0
            }
        )
        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()
        
        comapnyAddress = rs.get_value("{0}_companyAddress".format(mobile_no))
        address = frappe.get_doc(
            {
                "doctype": "Address",
                "phone" : mobile_no,
                "email_id": rs.get_value("{0}_email".format(mobile_no)),
                "address_title": rs.get_value("{0}_company".format(mobile_no)),  
                "address_type":"Office",
                "address_line1": comapnyAddress['address_line1'],
                "address_line2": comapnyAddress['address_line2'],
                "city": comapnyAddress['city'],
                "pincode": comapnyAddress['pincode'],
            }
        )
        address.flags.ignore_permissions = True
        address.insert()

        otoken = create_bearer_token(mobile_no, client_id)
        user_roles = frappe.get_roles(otoken.user)

        out = {
            "access_token": otoken.access_token,
            "refresh_token": otoken.refresh_token,
            "expires_in": otoken.expires_in,
            "scope": otoken.scopes,
            "user_details": {
                "user": otoken.user,
                "full_name": user.full_name,
                "roles": user_roles,
                "mobile": mobile_no,
                "user_type": frappe.get_value("User", otoken.user, "user_type")
            }
        }
    else:
        frappe.throw(data, title=message, exe=ValidationError)

    rs.delete_key(mobile_no + "_otp")
    frappe.local.response = frappe._dict(out)


@frappe.whitelist(allow_guest=True)
def logout():
    token_doc = frappe.get_doc("OAuth Bearer Token", {"user":frappe.session.user})
    token_doc.status = "Revoked"
    token_doc.save(ignore_permissions=True)
    frappe.db.commit()
    return "Logout Successfully"


def create_bearer_token(mobile_no, client_id):
    otoken = frappe.new_doc("OAuth Bearer Token")
    otoken.access_token = frappe.generate_hash(length=30)
    otoken.refresh_token = frappe.generate_hash(length=30)
    otoken.user = frappe.db.get_value("User", {"mobile_no": mobile_no}, "name")
    otoken.scopes = "all"
    otoken.client = client_id
    otoken.redirect_uri = frappe.db.get_value("OAuth Client", client_id, "default_redirect_uri")
    otoken.expires_in = 3600
    otoken.save(ignore_permissions=True)
    frappe.db.commit()

    return otoken


def otp_not_expired(otp_json):
    flag = True
    diff = frappe.utils.get_datetime().utcnow() - frappe.utils.get_datetime(otp_json.get("timestamp"))
    if int(diff.seconds) / 60 >= 10:
        flag = False

    return flag


@frappe.whitelist()
def get_current_user():
    user = frappe.session.user
    user_details = frappe.get_doc("User", user)
    return user_details.as_dict()


@frappe.whitelist()
def get_vehicle_data():
    try:
        vehicles = frappe.get_all("Vehicle", fields=["name", "latitude", "longitude"])

        vehicles_data = []
        for vehicle in vehicles:
            vehicle_data = {
                "name": vehicle.name,
                "latitude": vehicle.latitude,
                "longitude": vehicle.longitude
            }
            vehicles_data.append(vehicle_data)


        print(vehicles_data)

        return vehicles_data

    except Exception as e:
        # Handle exceptions if any
        print(f"Error fetching vehicle data: {str(e)}")
        return {"error": f"Error : {str(e)}"}


# Enable CORS for this specific API endpoint
def setup_cors():
    frappe.local.flags.allow_origin = "*"

# Call setup_cors function before handling the request
setup_cors()


@frappe.whitelist()
def create_vehicle_assignments(vehicles, opportunity_id):
    
        oppo = frappe.get_doc("Opportunity", opportunity_id)
        vehicles_list = json.loads(vehicles)
        
        if oppo.order_status == "New":
            if vehicles_list:
                no_of_vehicles = len(vehicles_list)
                if no_of_vehicles >= 1:
                    if oppo.multiple_vehicles == 1 and len(oppo.vehicle_details_item) == no_of_vehicles:
                        for vehicle_id in vehicles_list:
                            vehicle = frappe.get_doc("Vehicle", vehicle_id) 
                            vehicle_assignment = frappe.new_doc('Vehicle Assignment')
                            
                            vehicle_assignment.assignment_date = frappe.utils.today()       
                            if vehicle.assigned_driver:
                                vehicle_assignment.driver_id = vehicle.assigned_driver	
                            if vehicle.assigned_helper:
                                vehicle_assignment.helper_id = vehicle.assigned_helper
                            vehicle_assignment.vehicle_id = vehicle_id   
                            if oppo.receiver_information:
                                for itm in oppo.receiver_information:
                                    vehicle_assignment.append("routes", {
                                        "order_id": opportunity_id,
                                        "transit_type": itm.transit_type,
                                        "zone": itm.zone,
                                        "latitude":itm.latitude,
                                        "longitude":itm.longitude
                                    })
                            
                            if vehicle.vehicle_type:
                                vehicle_assignment.assigned_vehicle = vehicle.vehicle_type
                                
                            
                            vehicle_assignment.order = opportunity_id
                            vehicle_assignment.insert()
                    
                        return {"msg": "Vehicle assignments created successfully."}
                    if oppo.multiple_vehicles == 0 and no_of_vehicles == 1:
                        for vehicle_id in vehicles_list:
                            vehicle = frappe.get_doc("Vehicle", vehicle_id) 
                            vehicle_assignment = frappe.new_doc('Vehicle Assignment')
                            vehicle_assignment.assignment_date = frappe.utils.today()
                            if vehicle.assigned_driver:
                                vehicle_assignment.driver_id = vehicle.assigned_driver	
                            if vehicle.assigned_helper:
                                vehicle_assignment.helper_id = vehicle.assigned_helper
                                
                            vehicle_assignment.vehicle_id = vehicle_id 
                            if oppo.receiver_information:
                                for itm in oppo.receiver_information:
                                    vehicle_assignment.append("routes", {
                                        "order_id": opportunity_id,
                                        "transit_type": itm.transit_type,
                                        "zone": itm.zone
                                    })
                            
                            if oppo.vehicle_type:
                                vehicle_assignment.assigned_vehicle = vehicle.vehicle_type
                                vehicle_assignment.type_of_vehicles = oppo.vehicle_type
                            
                            vehicle_assignment.order = opportunity_id
                            vehicle_assignment.insert()
                    
                        return {"msg": "Vehicle assignments created successfully."}
                    else:
                        return {"msg1": "Please choose required no of vehicles same as the opportunity."}
                else:
                    return {"msg1": "Please select at least one vehicle."}
            else:
                return {"msg1": "No vehicles selected."}
        else:
            return{"msg1": "Please check the opportunity."}





@frappe.whitelist()
def get_order_status(opportunity_id):
    data = {}
    oppo = frappe.get_doc("Opportunity", opportunity_id)
    if oppo.status == "Vehicle Assigned":
        data["status"] = "Vehicle Assigned"
    return data

@frappe.whitelist()
def get_zone_details(opportunity_id):
    print("KKKKK")
    data ={}
    oppo = frappe.get_doc("Opportunity",opportunity_id)
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


@frappe.whitelist()
def get_vehicles(vehicle_type):
    # Split the incoming vehicle_type string into a list
    vehicle_types_list = vehicle_type.split(",") if vehicle_type else []
    print(vehicle_types_list,"///")
    
    # Perform filtering based on multiple vehicle types if available
    if vehicle_types_list:
        vehicles = frappe.get_all(
            "Vehicle",
            filters={"vehicle_status": "Available", "vehicle_type": ["in", vehicle_types_list]},
            fields=["name", "vehicle_type"]
        )
        print(vehicles,">>>>>")
        return vehicles
    else:
        # If no vehicle types are provided, return an empty list or handle the case as needed
        return []


@frappe.whitelist()
def get_all_vehicles(zone, vehicle_type):
    print(zone, "**")
    vehicle_types_list = vehicle_type.split(",") if vehicle_type else []
    print(vehicle_types_list,"///")
    
    # Perform filtering based on multiple vehicle types if available
    if vehicle_types_list:
        vehicles = frappe.get_all(
            "Vehicle",
            filters={"vehicle_status": "Available", "vehicle_type": ["not in", vehicle_types_list]},
            fields=["name", "vehicle_type"]
        )
    # vehicles = frappe.get_all(
    #     "Vehicle",
    #     filters={"vehicle_status": "Available", "vehicle_type": ["!=", vehicle_type]},
    #     fields=["name", "vehicle_type"]
    # )
    if vehicles:
        return vehicles




@frappe.whitelist()
def get_arriving_vehicles(zone):
    
    assignment_list = frappe.get_all("Vehicle Assignment")
    data = {}
    current_datetime = datetime.now()

    for assignment in assignment_list:
    
        vehicle_assignment = frappe.get_doc("Vehicle Assignment", assignment.name)
    
        if vehicle_assignment.routes:
            last_route = vehicle_assignment.routes[-1]
            if last_route.zone == zone and last_route.eta:
                data["vehicle"] = vehicle_assignment.vehicle_id
                vehicle_doc = frappe.get_doc("Vehicle",vehicle_assignment.vehicle_id)
                if vehicle_doc.vehicle_type:
                    data["veh_type"] = vehicle_doc.vehicle_type
                data["to"] = last_route.zone
                print(data["to"], "@@@@", last_route.eta)

                if isinstance(last_route.eta, datetime):
                    eta_datetime = last_route.eta
                else:
                    # Convert ETA string to datetime object for comparison
                    eta_datetime = datetime.strptime(last_route.eta, '%Y-%m-%d %H:%M:%S')

                if eta_datetime > current_datetime:
                    
                    remaining_time = eta_datetime - current_datetime
                    hours = remaining_time.seconds // 3600
                    minutes = (remaining_time.seconds % 3600) // 60
                    remaining_time_str = f"{hours:02d}:{minutes:02d}"  # Format hours and minutes as 'hh:mm'
                    data["time"] = remaining_time_str
                    print(remaining_time_str)
                    if remaining_time_str:
                        return data		
                    else:
                        data["msg"] = "No Vehicles Found"
                        return data
            
@frappe.whitelist()
def get_vehicle_assignments(user):
    print(user)
