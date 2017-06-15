#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

export $(cat dump.env)
python crawler.py
node processor.js
rm -rf data/*
