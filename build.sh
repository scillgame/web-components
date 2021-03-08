#!/usr/bin/env bash
npm install && npm run build:elements && rm -rf package-lock.json && rm -rf node_modules/ && rm -rf dist/ 
