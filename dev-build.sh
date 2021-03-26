#!/usr/bin/env bash
npm install && npm run build:dev
cd dev-elements
s3cmd put -m text/javascript scill-dev-widgets.js -m text/css scill-dev-widgets.css s3://scill-gaas-01/
echo 'Setting public permissions'
s3cmd setacl s3://scill-gaas-01/scill-dev-widgets.js --acl-public
s3cmd setacl s3://scill-gaas-01/scill-dev-widgets.css --acl-public


