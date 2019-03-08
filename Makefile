SHELL := /bin/bash
LEGACY_ROOT = $(CURDIR)/legacy/*

DESTDIR ?=
PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

LEGACY = ${INSTALL_DIR}/share/tizen-web-ui-fw/

NODE = /usr/bin/node

all: version

version:
	sed -i -e 's/$(shell cat packaging/web-ui-fw.spec | grep Version: | sed -e "s@Version:\s*@@")/$(shell cat tau/package.json | grep version | sed -e 's@\s"version": "@@' -e 's@",@@')/g' packaging/web-ui-fw.spec

install:
	mkdir -p ${LEGACY}
	# copy framework
	cp -av ${LEGACY_ROOT} ${LEGACY}
