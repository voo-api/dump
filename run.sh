#!/bin/bash

sudo service tor stop
python crawler.py
npm start
rm -rf data/*
