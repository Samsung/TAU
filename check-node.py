#!/usr/bin/env python

import json, subprocess, re, sys

current_node_version = []
expected_node_version = []

def get_version(s):
	return re.sub('[v\n]', '', s).split('.')

def version_to_str(l):
	s = '.'
	s = s.join(l)
	return s

with open('package.json') as f:
	data = json.load(f)
expected_node_version = get_version(str(data['engines']['node']))

try:
	current_node_version = get_version(subprocess.check_output('node --version', shell=True))
except subprocess.CalledProcessError as e:
	print 'Could not get node version, Please install nvm and execute nvm use.'
	print e.output
	sys.exit(1)

if len(current_node_version) < 2 or len(expected_node_version) < 2:
	print 'Not enough information about node version.'
	sys.exit(1)

# Major and minor version are expected to be equal.
if current_node_version[0] != expected_node_version[0] or current_node_version[1] != expected_node_version[1]:
	print 'Current node version is %s but should be %s. Please install nvm and execute nvm use.' % (version_to_str(current_node_version), version_to_str(expected_node_version))
	sys.exit(1)

print 'Node version ok!'
