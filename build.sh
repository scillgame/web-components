#!/usr/bin/env bash
sudo rsync -r /home/gitlab-runner/builds/hyQTHNpm/0/scill/gaas/sdks/web-components /var/www/
cd /var/www/web-components && npm install && npm run build:elements
