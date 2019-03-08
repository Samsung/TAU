#!/bin/bash
# This script builds framework rpm using gbs and installs them on target device.
# How to use:
#   run ./tau2device.sh
#   or
#   run ./tau2device.sh <device_serial_number>
#
# IMPORTANT: before use please provide path to rpm's in RPM_SRC variable
#
# If there are some problems with RPM installation, please try to remove
# old packages on target device before instalation.
# To remove packages run following command in target device shell:
# rpm -e <package_name>
# e.g. rpm -e web-ui-fw-theme-tizen-black-0.2.83-1.1.redwood8974xx.noarch
#
# author Michał Szepielak <m.szepielak@samsung.com>

# Defines target device.
# If multiple target devices are connected you can specify it by passing
# target's serial number as argument;
# ./tau2device.sh <device_serial_number>
#
# Define target as '-s <serial_number>' to specify default target
# that is connected or leave it empty if only one target is connected.
# e.g. TARGET="-s emulator-11101"
TARGET=""

# Source path to RPM files with build framework by GBS
# e.g. /home/m.szepielak/GBS-ROOT/local/repos/tizendev/armv7l/RPMS
RPM_SRC=""

# Destination path to upload RPM files on device. Please do not change this path
RPM_DEST="/tmp/tauRpm"

# Check if serial number is passed
if [ "${1}" != "" ] ; then
	TARGET="-s ${1}"
fi

# If TARGET was not passed and there are multiple devices connected suggest
# which target should be used
if [ -z "${TARGET}" ] && [ `sdb devices | wc -l` -gt 2 ] ; then
	sdb devices
	read -e -p "Which target want to use? " TARGET
	TARGET="-s ${TARGET}"
fi

DEVICE_STATUS=`sdb ${TARGET} get-state`
if [ "${DEVICE_STATUS}" != "device" ] ; then
	exit
else
	echo "OK: Device connected"
fi

# Clean old RPMs
rm -f $RPM_SRC/*
# Build RPMs
gbs build -A armv7l --include-all

########################### Start working on device ############################
# Turn on root mode
sdb $TARGET root on
# Remount root.
sdb $TARGET shell "mount -o remount,rw /"

sdb $TARGET shell "if [ ! -d '/tmp' ] ; then
	mkdir /tmp
	fi"

sdb $TARGET shell "if [ ! -d '/tmp' ] ; then
	mkdir /tmp/tauRpm
	fi"

sdb $TARGET push $RPM_SRC $RPM_DEST

for filePath in $RPM_SRC/*
do
  fileName=`basename $filePath`
  sdb $TARGET shell "rpm -Uvh --force --nodeps ${RPM_DEST}/${fileName}"
done

echo "DONE!"