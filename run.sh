#!/bin/bash

echo "[$(date)] Starting to crawl"
cd crawler && sh run.sh && cd ..
cp -r crawler/data reduce/data
echo "[$(date)] Reducing ..."
cd reduce && sh run.sh && cd ..
echo "[$(date)] Publishing..."
cp -r reduce/reduced publish/reduced
cd publish && sh run.sh && cd ..


#cleaning
echo "[$(date)] Cleaning..."
rm -rf crawler/data/ reduce/data/ reduce/reduced/ publish/reduced/
