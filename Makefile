REPORTER ?= spec
TESTS = $(shell find ./test/* -name "*.test.js")
DIALECT ?= mysql

test:
	./node_modules/mocha/bin/mocha --check-leaks --colors -t 10000 --reporter ${REPORTER} ${TESTS}

mariadb:
	@SEQ_DIALECT=mariadb make test
mysql:
	@SEQ_DIALECT=mysql make test
postgres:
	@SEQ_DIALECT=postgres make test

pgsql: postgres

all: mysql postgres mariadb

.PHONY: mysql postgres pgsql all test