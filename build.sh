#!/usr/bin/env bash
/usr/bin/npm install && /usr/bin/npm run build:elements && /usr/bin/rm -rf package-lock.json && /usr/bin/rm -rf node_modules/ && /usr/bin/rm -rf dist/ && sudo rsync -r /home/gitlab-runner/builds/hyQTHNpm/0/scill/gaas/sdks/web-components /var/www/
