#!/bin/bash

rm ./index.html
rm -rf docs
mkdir docs

rm -rf tmp;
cp -R src tmp;
cp -R src/assets tmp/layout/assets;
./node_modules/.bin/generate-md --layout tmp/layout --input tmp/docs --output "docs";
cp src/index.html ./index.html;

rm -rf tmp
