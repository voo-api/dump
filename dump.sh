#!/bin/bash

python crawler.py
zip "flight-data-$(date --iso-8601=minutes).zip" -r data/
