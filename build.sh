#!/usr/bin/env bash
rm -rf package-lock.json && rm -rf node_modules/ && npm install && npm run build:elements 
