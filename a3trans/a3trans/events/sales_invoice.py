import frappe
from datetime import date
from datetime import date
from datetime import datetime
import calendar
from functools import reduce
from frappe.utils import add_to_date
from dataclasses import fields
from email import policy
from pydoc import doc
from warnings import filters
from frappe import get_doc, get_list, get_single, new_doc, publish_progress, _
from frappe.core.doctype.file.file import create_new_folder
from frappe.utils.file_manager import save_file
from datetime import datetime
import requests
from re import findall
from json import dumps
import pdfkit



def after_insert(doc,methods):
	if doc.order_id:
		if frappe.db.exists("Opportunity",doc.order_id):
			oppo = frappe.get_doc("Opportunity",doc.order_id)
			
			oppo.invoice_id = doc.name

			oppo.db_update()
			frappe.db.commit()	

def attach_pdf(doc, event=None):
	fallback_language = frappe.db.get_single_value("System Settings", "language") or "en"
	args = {
	"doctype": doc.doctype,
	"name": doc.name,
	"title": doc.get_title(),
	"lang": getattr(doc, "language", fallback_language),
	"show_progress": 0
	}
	fileurl = execute(**args)
	print(fileurl.file_url)
	if doc.order_id :
		opportunity = frappe.get_doc("Opportunity", doc.order_id)
	
			# opportunity.sales_invoice_pdf_url=fileurl.file_url
			# opportunity.save()


def enqueue(args):
	"""Add method `execute` with given args to the queue."""
	frappe.enqueue(method=execute, queue='long', is_async=False, timeout=3000, **args)
def execute(doctype, name, title, lang=None, show_progress=True):
	"""
	Queue calls this method, when it's ready.
	1. Create necessary folders
	2. Get raw PDF data
	3. Save PDF file and attach it to the document
	"""
	progress = frappe._dict(title=_("Creating PDF ..."), percent=0, doctype=doctype, docname=name)


	if lang:
		frappe.local.lang = lang


	if show_progress:
		publish_progress(**progress)


	doctype_folder = create_folder(_(doctype), "Home")
	title_folder = create_folder(title, doctype_folder)


	if show_progress:
		progress.percent = 33
		publish_progress(**progress)


	pdf_data = get_pdf_data(doctype, name)


	if show_progress:
		progress.percent = 66
		publish_progress(**progress)


	fileurl = save_and_attach(pdf_data, doctype, name, title_folder)


	if show_progress:
		progress.percent = 100
		publish_progress(**progress)

	return fileurl


def create_folder(folder, parent):
	"""Make sure the folder exists and return it's name."""
	new_folder_name = "/".join([parent, folder])


	if not frappe.db.exists("File", new_folder_name):
		create_new_folder(folder, parent)


	return new_folder_name




def get_pdf_data(doctype, name):
	"""Document -> HTML -> PDF."""
	html = frappe.get_print(doctype, name)
	return frappe.utils.pdf.get_pdf(html)




def save_and_attach(content, to_doctype, to_name, folder):
	"""
	Save content to disk and create a File document.
	File document is linked to another document.
	"""
	file_name = "{}.pdf".format(to_name.replace(" ", "-").replace("/", "-"))
	fileName = save_file(file_name, content, to_doctype,
	to_name, folder=folder, is_private=0)
	print(file_name,fileName,"///////////////////////////////")
	return fileName


def before_submit(doc, method):
	if doc.items and doc.order_id:
		oppo = frappe.get_doc("Opportunity", doc.order_id)
		if oppo.status != "Lost":
			if oppo.transit_charges:
				for charge_item in oppo.transit_charges:
					for itm in doc.items:
						if itm.idx == charge_item.idx:
							itm.description = charge_item.description
			if oppo.opportunity_line_item:
				for itm in doc.items:
					for line in oppo.opportunity_line_item:
						if itm.item_code == line.item:
							line.status = "Invoice"
							if line.include_in_billing == 0:
								line.include_in_billing=1
							oppo.save()






		