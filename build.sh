#!/usr/bin/env bash
sudo npm install && sudo npm run build:elements && rsudo m -rf package-lock.json && sudo rm -rf node_modules/ && sudo rm-rf dist/ && sudo rsync -r /home/gitlab-runner/builds/hyQTHNpm/0/scill/gaas/sdks/web-components /var/www/
