import frappe, json
import random
from frappe.auth import clear_cookies
from frappe.utils.pdf import get_pdf
from frappe.utils import cint
from datetime import datetime
from frappe.sessions import clear_sessions, delete_session
import requests


@frappe.whitelist(allow_guest=True)
def get(mobile_no=None):
    def generate_otp():
        otp = ''.join(["{}".format(random.randint(0, 9)) for i in range(0, otp_length)])
        return {"id": key, "otp": otp, "timestamp": str(frappe.utils.get_datetime().utcnow())}

    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            frappe.throw("NOMOBILE", exc=LookupError)

    u = frappe.db.get_value("User", {"mobile_no": mobile_no}, "name")

    if not u:
        frappe.throw("USERNOTFOUND", exc=LookupError)

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
    out = {
        "OTPGENERATED":otp_json.get("otp"),
        }
    frappe.local.response = frappe._dict(out)


@frappe.whitelist(allow_guest=True)
def get_for_signup(mobile_no=None, first_name=None, last_name=None, email=None):
    def generate_otp_for_signup():
        otp = ''.join(["{}".format(random.randint(0, 9)) for i in range(0, otp_length)])
        return {"id": key, "otp": otp, "timestamp": str(frappe.utils.get_datetime().utcnow())}

    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            frappe.throw("NOMOBILE", exc=LookupError)

    if not first_name:
        first_name = frappe.form_dict.get("first_name")
        if not first_name:
            frappe.throw("NOFIRSTNAME", exc=LookupError)
    
    if not last_name:
        last_name = frappe.form_dict.get("last_name")
        if not last_name:
            frappe.throw("NOLASTNAME", exc=LookupError)

    if not email:
        email = frappe.form_dict.get("email")
        if not email:
            frappe.throw("NOEMAIL", exc=LookupError)

    u = frappe.db.get_value("User", {"mobile_no": mobile_no}, "name")

    if u:
        frappe.throw("MOBILEALREADYEXIST", exc=LookupError)

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

    """
    FIRE SMS FOR OTP
        "{0} is your OTP for AgriNext. Do not share OTP with anybody. Thanks.".format(otp_json.get("otp"))
    """

    out = {
        "OTPGENERATED":otp_json.get("otp"),
        }
    
    # sms_settings = frappe.get_single("SMS Settings")
    # apikey = ""
    # sender = ""
    # otp = otp_json.get("otp")
    # for params in sms_settings.parameters:
    #     if params.parameter == "apikey":
    #         apikey = params.value
    #     elif params.parameter == "sender":
    #         sender = params.value

    # requests.post(sms_settings.sms_gateway_url, data={
    #     "apikey":apikey,
    #     "sender": sender,
    #     "number": mobile_no,
    #     "message": f"KEMDEL UPDATES: Click on the link to initiate payment for your order no: {otp} - SN83. For more info: www.google.com - COFBA NETWORKS"
    # })

    # return "OTPGENERATED:{0}".format(otp_json.get("otp"))  # MUST DISABLE IN PRODUCTION!!
    frappe.local.response = frappe._dict(out)


@frappe.whitelist(allow_guest=True)
def authenticate(otp=None, mobile_no=None, client_id=None):
    if not otp:
        otp = frappe.form_dict.get("otp")
        if not otp:
            frappe.throw("NOOTP")

    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            frappe.throw("NOMOBILENO")

    if not client_id:
        client_id = frappe.form_dict.get("client_id")
        if not client_id:
            frappe.throw("NOCLIENTID")

    rs = frappe.cache()
    otp_json = rs.get_value("{0}_otp".format(mobile_no))

    if otp_json.get("otp") != otp:
        frappe.throw("OTPNOTFOUND")

    if not otp_not_expired(otp_json):
        frappe.throw("OTPEXPIRED")

    otoken = create_bearer_token(mobile_no, client_id)
    user_roles = frappe.get_roles(otoken.user)
        

    out = {
        "access_token": otoken.access_token,
        "refresh_token": otoken.refresh_token,
        "expires_in": otoken.expires_in,
        "scope": otoken.scopes,
        "user_details": {
            "user": otoken.user,
            "roles": user_roles,
            "user_type": frappe.get_value("User", otoken.user, "user_type")
        }
    }

    # Delete consumed otp
    rs.delete_key(mobile_no + "_otp")

    frappe.local.response = frappe._dict(out)

@frappe.whitelist(allow_guest=True)
def authenticate_for_signup(otp=None, mobile_no=None, client_id=None):
    if not otp:
        otp = frappe.form_dict.get("otp")
        if not otp:
            frappe.throw("NOOTP")

    if not mobile_no:
        mobile_no = frappe.form_dict.get("mobile_no")
        if not mobile_no:
            frappe.throw("NOMOBILENO")

    if not client_id:
        client_id = frappe.form_dict.get("client_id")
        if not client_id:
            frappe.throw("NOCLIENTID")

    rs = frappe.cache()
    otp_json = rs.get_value("{0}_otp".format(mobile_no))

    if otp_json.get("otp") != otp:
        frappe.throw("OTPNOTFOUND")

    if not otp_not_expired(otp_json):
        frappe.throw("OTPEXPIRED")

    user = frappe.new_doc("User")
    user.first_name = rs.get_value("{0}_firstname".format(mobile_no))
    user.last_name = rs.get_value("{0}_lastname".format(mobile_no))
    user.email = rs.get_value("{0}_email".format(mobile_no))
    user.mobile_no = mobile_no
    user.send_welcome_email = 0
    user.insert()

    otoken = create_bearer_token(mobile_no, client_id)
    user_roles = frappe.get_roles(otoken.user)

    out = {
        "access_token": otoken.access_token,
        "refresh_token": otoken.refresh_token,
        "expires_in": otoken.expires_in,
        "scope": otoken.scopes,
         "user_details": {
            "user": otoken.user,
            "roles": user_roles,
            "user_type": frappe.get_value("User", otoken.user, "user_type")
        }
    }

    # Delete consumed otp
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