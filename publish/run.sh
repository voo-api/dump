#!/bin/bash

export $(cat publish.env)
node publish.js
