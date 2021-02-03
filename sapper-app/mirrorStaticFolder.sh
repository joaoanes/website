#!/bin/bash

set -o pipefail
set -e

rm -rf ./static/*
cp -r ../public/* ./static/
rm ./static/index.html
rm -rf ./static/build || true
rm -rf ./static/vendor || true
