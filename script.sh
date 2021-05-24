#!/bin/bash

yarn run build

files=$(ls ../build_rep)
for file in $files 
do
  rm -r ../build_rep/$file
done

cp -r ./dist/* ../build_rep
cp -r ./models ../build_rep
cp -r ./content ../build_rep

cd ../build_rep || exit
ls -a

git add *; git commit -m "update"; git push
