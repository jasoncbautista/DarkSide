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


files =""
# Itearate through all files
for f in $*
do
	if [ -r ${f} ]
	then
		files="${code}" 
	else
		echo "File ${f} does not exist or is not readable. Skipped."
	fi
done


# Itearate through all files
cat $* > $NEWFILE
