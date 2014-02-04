#!/bin/sh
inotifywait -m -r --format '%f' -e modify -e move -e create -e delete src  | while read LINE; 
do 
      ./build.sh
      ./runLinter.sh
done
