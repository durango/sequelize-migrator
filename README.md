# sequelize-migrator [![Build Status](https://travis-ci.org/durango/sequelize-migrator.png?branch=master)](https://travis-ci.org/durango/sequelize-migrator)

Migrate SequelizeJS migrations without SequelizeMeta table dependency.

## Install

```npm install -g sequelize-migrator```

## Help

```
  Usage: sequelize-migrator [options] <up|down>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -c, --config [config]  Specify a config file for database credentials
    -p, --path [path]      Specify a specific migrations folder.
```

## Examples

```
$: sequelize-migrator -c ../../global_config.json -p ../migrations up
$: sequelize-migrator -c ../../global_config.json -p ../migrations down
$: sequelize-migrator -c ../../global_config.json up # looks for ./migrations within path
```

## Config File Example

```js
module.exports = {
  username: process.env.SEQ_USER    || '',
  password: process.env.SEQ_PW      || null,
  database: process.env.SEQ_DB      || '',
  host:     process.env.SEQ_HOST    || '127.0.0.1',
  port:     process.env.SEQ_PORT    || [dialect specific]
  dialect:  process.env.SEQ_DIALECT || '',
}
```

## Dependencies

Dependencies can be added via a "deps" array key within the migration files like so...

### [timestamp]-userTable.js
```js
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'email', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'email').complete(done);
  }
}
```

### [timestamp]-usersAddEmail.js
```js
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'email', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'email').complete(done);
  }
}
```

### [timestamp]-usersAddTest.js
**Note:** [timestamp] is *before* usersAddEmail
```js
module.exports = {
  deps: [
    '20140105151356-usersAddEmail'
  ],
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'test', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'test').complete(done);
  }
}
```

### [timestamp]-usersAddTest2.js
**Note:** [timestamp] is *before* usersAddTest
```js
module.exports = {
  deps: [
    '20140105151200-usersAddTest'
  ],
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'test2', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'test2').complete(done);
  }
}
```

Dependencies are matched on a case-sensitive regex. Feel free to shorten dependency names such as ```20140105151200-usersAddTest``` into ```usersAddTest```. This will fetch all migrations that match "usersAddTest".
