#!/bin/bash
# This script creates TCT Package located in tct-package and automaticaly runs
# TCT tests
#
# Author: Michał Szepielak <m.szepielak@samsung.com>
echo "tct-paker.sh"

# Config params
TIZEN_VERSION=5.5
TEST_FILENAME=tct-webuifw-tests01-${TIZEN_VERSION}.zip
TEST_NAME=tct-webuifw-tests

# Aliases
TB=`tput bold`
TN=`tput sgr0`

USAGE_PROMPT="
Usage: ./tct-paker.sh [OPTION]
  ${TB}-c, --clean-cache${TN}
  	cleans testkit lite cache directory from cached tct packages (/opt/testkit/lite/)
  ${TB}-p, --pack-only${TN}
  	creates only TCT Packages. Testkit won't be fired
  ${TB}-n <package_ID>, --number <package_ID>${TN}
  	creates TCT package with provided ID.
  "

case "$1" in
    -h|--help) echo "$USAGE_PROMPT"
               exit ;;
    -c|--clean-cache)
	    # Remove tmp directiories from testkit lite, to be sure,
		# that running package is not cached
     	echo "Cleaning cache directory"
     	sudo rm -rf /opt/testkit/lite/*-*-*
    	;;
    "") # empty argument is ok
    	PACK_ONLY=0
    	;;
	-p|--pack-only)
		PACK_ONLY=1
		;;
	-n|--number)
		PACK_ONLY=1
		PACKAGE_NUMBER=$2
		TEST_FILENAME=${TEST_NAME}0${PACKAGE_NUMBER}-${TIZEN_VERSION}.zip
		TEST_NAME=${TEST_NAME}0${PACKAGE_NUMBER}
		echo "Building package ${PACKAGE_NUMBER}   =>    ${TEST_NAME}"
		;;
    *) echo "$USAGE_PROMPT"
       exit ;;
esac

rm -rf tct-package/opt
mkdir -p tct-package/opt/
mkdir -p tct-package/opt/$TEST_NAME/

# Copy runner application to package
cp tct-packages/$PACKAGE_NUMBER/webuifwtcs.tctwebuifwtest.wgt tct-package/opt/$TEST_NAME/$TEST_NAME.wgt

cp tct-packages/$PACKAGE_NUMBER/tau-runner/tests.xml tct-package/opt/$TEST_NAME/tests.xml

# Copy inst.py
cp tct-package/inst.py tct-package/opt/$TEST_NAME/inst.py

# Change working directory
cd tct-package

# Remove old package if exists
if [ -f $TEST_FILENAME ] ; then
	rm $TEST_FILENAME
fi
# Pack package
zip -9 -y -r -q $TEST_FILENAME opt

if [ $PACK_ONLY -eq 1 ]; then
	echo "Package was created in ./tct-package/${TEST_FILENAME}"
	exit
fi

# If there are multiple devices connected exit
if [ `sdb devices | awk '/List of devices/{getline; print}' | wc -l` -gt  ] ; then
	echo "Only one connected device or emulator is supported. Please unplug other devices or close emulators"
	echo "Package was created, but tests didn't run!"
	exit
fi
