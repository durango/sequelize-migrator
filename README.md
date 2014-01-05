# sequelize-migrator

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

```$: sequelize-migrator -c ../../global_config.json -p ../migrations up```

## Config File Example

```
module.exports = {
  username: process.env.SEQ_USER    || '',
  password: process.env.SEQ_PW      || null,
  database: process.env.SEQ_DB      || '',
  host:     process.env.SEQ_HOST    || '127.0.0.1',
  port:     process.env.SEQ_PORT    || [dialect specific]
  dialect:  process.env.SEQ_DIALECT || '',
}
```