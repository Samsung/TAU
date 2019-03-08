# Prepare apps to compare
cd demos
grunt run:build prepare-ce-test-app


# Commands to compare UIComponents and UIComponentsCE

## mobile
karma start tests/karma/uicomponents.mobile.conf.js

## wearable
karma start tests/karma/uicomponents.wearable.conf.js


