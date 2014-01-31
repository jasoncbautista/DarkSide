if [ $# -eq 0 ]
then
	echo './script nameOfReport'
	exit
fi


plato -r -d reports/$* -t "DarkSide" -x src/thirdparty src   
