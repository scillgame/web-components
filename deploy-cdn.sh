#!sh
echo 'Uploading cdn files....'
cd elements
s3cmd put scill-widgets.js scill-widgets.css s3://scill-gaas-01/

echo 'Setting public permissions'
s3cmd setacl s3://scill-gaas-01/scill-widgets.js --acl-public
s3cmd setacl s3://scill-gaas-01/scill-widgets.css --acl-public
