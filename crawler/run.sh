#!/bin/bash

rm -rf data/
mkdir -p data

export $( cat crawler.env )

python crawler.py
zipfile="flight-data-$(date --iso-8601=minutes).zip"
zip $zipfile -r data/

git clone --depth 1 git@github.com:voo-api/records.git records
mv $zipfile records/
cd records && git add . && git commit -m "[Generated] publishing flight data from crawler" && git push origin master && cd ../ && rm -rf records
