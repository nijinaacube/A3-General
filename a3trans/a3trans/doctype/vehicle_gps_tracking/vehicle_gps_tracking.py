# Copyright (c) 2023, Nijina A and contributors
# For license information, please see license.txt

import frappe
import requests

from frappe.model.document import Document

class VehicleGPSTracking(Document):
	pass


	# Define the URL of the GPS tracking API
	api_url = "http://192.168.0.89:8080/GPS/webservice"

	# Define API parameters
	params = {
		"token": "getLiveData",
		"user": "admin",
		"pass": "admin",
		"vehicle_no": "4071",
		"format": "json"  # Change the format as needed (json, xml, csv)
	}

	try:
		# Make an API request
		response = requests.get(api_url, params=params)

		if response.status_code == 200:
			# Assuming the API returns JSON data
			data = response.json()

			# Create or update records in the custom DocType
			for item in data.get("root", {}).get("VehicleData", []):
				doc = frappe.get_doc({
					"doctype": "Vehicle GPS Tracking",  # Replace with your custom DocType name
					"company": item.get("Company"),
					"branch": item.get("Branch"),
					"vehicle_no": item.get("Vehicle_No"),
					"location": item.get("Location"),
					"datetime": item.get("Datetime"),
					"latitude": item.get("Latitude"),
					"longitude": item.get("Longitude"),
					"status": item.get("Status"),
					# Add other fields as needed
				})
				doc.insert(ignore_permissions=True)

		else:
			print(f"API request failed with status code {response.status_code}")

	except Exception as e:
		print(f"An error occurred: {str(e)}")

