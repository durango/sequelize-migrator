var url   = require('url')
  , path  = require('path')
  , fs    = require('fs');

module.exports = (function() {
  var config = function(configFile) {
    var self = this;

    this.username = '';
    this.password = '';
    this.database = '';
    this.dialect  = '';
    this.host     = '';
    this.port     = 0;

    if (configFile) {
      if (!fs.existsSync(path.resolve(path.join(process.cwd(), configFile)))) {
        throw new Error('Config file ' + path.resolve(path.join(process.cwd(), configFile)) + ' doesn\'t exist.');
      }

      // build our config properties based on the file
      var configData = require(path.resolve(process.cwd(), configFile));
      ['username', 'password', 'database', 'dialect', 'host', 'port'].forEach(function (d) {
        if (configData.hasOwnProperty(d)) {
          self[d] = configData[d];
        }
      });
    }

    // build our config based on SEQ_URL env variable...
    if (process.env.SEQ_URL) {
      var parsed = url.parse(process.env.SEQ_URL);

      if (parsed.auth) {
        var auth = parsed.auth.split(':');
        this.username = auth[0];
        this.password = auth[1] || null;
      }

      if (parsed.protocol) {
        this.dialect = parsed.protocol.replace(/:$/, '');
      }

      if (parsed.pathname) {
        this.database = parsed.pathname;
      }

      if (parsed.port) {
        this.port = parsed.port;
      }

      if (parsed.host) {
        this.host = parsed.host;
      }
    }

    // build our config based on SEQ_* env variables...
    [{k: 'SEQ_DB', v: 'database'}, {k: 'SEQ_USER', v: 'username'}, {k: 'SEQ_PW', v: 'password'}, {k: 'SEQ_HOST', v: 'host'}, {k: 'SEQ_PORT', v: 'port'}, {k: 'SEQ_DIALECT', v: 'dialect'}].forEach(function (d) {
      if (process.env.hasOwnProperty(d.k)) {
        self[d.v] = process.env[d.k];
      }
    });

    if (!this.username) {
      throw new Error('You must specify a database username');
    }

    if (!this.database) {
      throw new Error('You must specify a database');
    }

    if (!this.dialect) {
      throw new Error('You must specify a dialect');
    }

    if (!this.host) {
      this.host = '127.0.0.1';
    }

    if (!this.port) {
      switch(this.dialect.toLowerCase()) {
      case 'mysql':
      case 'mariadb':
        this.port = 3306;
        break;
      case 'postgres':
        this.port = 5432;
        break;
      }
    }
  }

  return config;
})();
