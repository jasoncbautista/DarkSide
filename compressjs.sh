#!/bin/bash

# Constants
SERVICE_URL=http://closure-compiler.appspot.com/compile
NEWFILE="compiled.js"

# Check if files to compile are provided
if [ $# -eq 0 ]
then
	echo 'Nothing to compile. Specify input files as command arguments. E.g.'
	echo './compressjs file1.js file2.js file3.js'
	exit
fi

# Itearate through all files
cat $* > $NEWFILE
