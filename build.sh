#!/usr/bin/env bash
npm install && npm run build:elements && rsync -r /home/gitlab-runner/builds/hyQTHNpm/0/scill/gaas/sdks/web-components /var/www/

