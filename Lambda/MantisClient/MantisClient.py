#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  MantisClient.py
#  
#  Copyright 2015 reply <reply@hubblue>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  
from suds.client import Client
import simplejson

WSURL = ""
USERNAME=""
PWD=""
DEVICEID="01:23:45:67:89:01"
DEVDATA = """{ "deviceID": "01:23:45:67:89:01", "Temperature": "23", "Distance": "45"}"""
MTPROJECT = "AWS IoT Demo"
MTCAT = "General"

def createMTIssue(summ, descr, proj, cat):
	client = Client(WSURL)

	MTissue= client.factory.create('IssueData')
	MTissue.project.name = proj
	MTissue.project.id = 0 # Mantis will try to evaluate it, chokes if unset
	MTissue.summary = summ
	MTissue.description = descr
	MTissue.category = cat
	MTissue.reproducibility.name = "N/A"
	MTissue.severity.name = "minor"
	MTissue.priority.name = "normal"
	MTissue.view_state.name = "public"
	MTissue.resolution.name = "open"
	MTissue.projection.name = "none"
	MTissue.eta.name = "none"
	MTissue.status.name = "new"

	client.service.mc_issue_add(USERNAME,PWD, MTissue)
	
def lambda_handler(event, context):

	MTsumm = "[Auto] Device: {0} generated an alarm event".format(event['deviceID'])
	MTdescr = "Device {0} generated an alarm due to xxxxx \n\nStatus information:\n\n {1}".format(event['deviceID'], simplejson.dumps(event['sensorData']))
	MTproj = MTPROJECT
	MTcat = MTCAT
	createMTIssue(MTsumm, MTdescr, MTproj, MTcat)
	return 0