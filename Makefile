REPORTER ?= spec
TESTS = $(shell find ./test/* -name "*.test.js")
DIALECT ?= mysql

tests:
	./node_modules/mocha/bin/mocha --check-leaks --colors -t 10000 --reporter ${REPORTER} ${TESTS}

test: tests

mariadb:
	@SEQ_DIALECT=mariadb make tests
mysql:
	@SEQ_DIALECT=mysql make tests
postgres:
	@SEQ_DIALECT=postgres make tests

pgsql: postgres

all: mysql postgres mariadb

.PHONY: mysql postgres pgsql all test tests
