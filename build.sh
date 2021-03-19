#!/usr/bin/env bash
npm install && npm run build:elements 
cd elements
s3cmd put -m text/javascript scill-widgets.js -m text/css scill-widgets.css s3://scill-gaas-01/
echo 'Setting public permissions'
s3cmd setacl s3://scill-gaas-01/scill-widgets.js --acl-public
s3cmd setacl s3://scill-gaas-01/scill-widgets.css --acl-public


