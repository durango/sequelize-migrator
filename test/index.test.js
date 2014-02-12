var path    = require('path')
  , chai    = require('chai')
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , Support = require(path.join(__dirname, 'support'))
  , fs      = require('fs')
  , config  = require(path.join(__dirname, 'config'))
  , cmd     = path.resolve(path.join(__dirname, '..', 'bin', 'sequelize-migrator'));

chai.Assertion.includeStack = true;

describe('sequelize-migrator', function() {
  ;(function (flags) {
    flags.forEach(function (flag) {
      describe(flag, function() {
        it("prints the help", function (done) {
          exec(cmd + ' ' + flag, function (err, stdout) {
            expect(stdout).to.include("Usage: sequelize-migrator [options] <up|down>")
            done();
          });
        });
      });
    });
  })(["--help", "-h"]);

  beforeEach(function () {
    process.chdir(__dirname);
  });

  afterEach(function (done) {
    var files = fs.readdirSync(path.join(__dirname, 'migrations'));
    files.forEach(function (f) {
      fs.renameSync(path.join(__dirname, 'migrations', f), path.join(__dirname, 'migrations', f.replace(/\.done$/, '')));
    });

    var _files = fs.readdirSync(path.join(__dirname, 'assets'));
    _files.forEach(function (f) {
      fs.renameSync(path.join(__dirname, 'assets', f), path.join(__dirname, 'assets', f.replace(/\.done$/, '')));
    });

    Support.clearDatabase(this.sequelize, done);
  });

  after(function (done) {
    process.chdir(path.join(__dirname, '..'));
    done();
  });

  describe('up', function() {
    beforeEach(function (done) {
      var files = fs.readdirSync(path.join(__dirname, 'migrations'));
      files.forEach(function (f) {
        fs.renameSync(path.join(__dirname, 'migrations', f), path.join(__dirname, 'migrations', f.replace(/\.done$/, '')));
      });

      var _files = fs.readdirSync(path.join(__dirname, 'assets'));
      _files.forEach(function (f) {
        fs.renameSync(path.join(__dirname, 'assets', f), path.join(__dirname, 'assets', f.replace(/\.done$/, '')));
      });

      done();
    });

    it('should be able to automatically find $PWD/migrations folder...', function (done) {
      exec(cmd + ' -c ./config.js up', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151203-userTable.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151199-depTest2.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should be able to grab migrations from a specified relative path...', function (done) {
      exec(cmd + ' -c ./config.js -p ./assets up', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151203-userTable-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151199-depTest2-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should be able to grab migrations from a specified absolute path...', function (done) {
      exec(cmd + ' -c ./config.js -p ' + path.resolve(path.join(__dirname, 'assets')) + ' up', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151203-userTable-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151199-depTest2-assets.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should be able to migrate from environment variables...', function (done) {
      var env = [
        'SEQ_USER=' + config.username,
        'SEQ_DB=' + config.database,
        'SEQ_DIALECT=' + config.dialect,
        'SEQ_HOST=' + config.host
      ];

      if (!!config.password) {
        env.push('SEQ_PW=' + config.password);
      }

      exec(env.join(' ') + ' ' + cmd + ' up', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151203-userTable.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151199-depTest2.js',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should say no pending migrations after we\'ve migrated...', function (done) {
      exec(cmd + ' -c ./config.js up', function () {
        exec(cmd + ' -c ./config.js up', function (err, stdout) {
          expect(stdout).to.include('There are currently no pending migrations.');
          done();
        });
      });
    });
  });

  describe('down', function() {
    beforeEach(function (done) {
      exec(cmd + ' -c ./config.js up', function () {
        exec(cmd + ' -c ./config.js -p ./assets up', function () {
          done();
        });
      });
    });

    it('should be able to automatically find $PWD/migrations folder...', function (done) {
      exec(cmd + ' -c ./config.js down', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151199-depTest2.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151203-userTable.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should be able to grab migrations from a specified relative path...', function (done) {
      exec(cmd + ' -c ./config.js -p ./assets down', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151199-depTest2-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151203-userTable-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should be able to grab migrations from a specified absolute path...', function (done) {
      exec(cmd + ' -c ./config.js -p ' + path.resolve(path.join(__dirname, 'assets')) + ' down', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151199-depTest2-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151203-userTable-assets.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should be able to migrate from environment variables...', function (done) {
      var env = [
        'SEQ_USER=' + config.username,
        'SEQ_DB=' + config.database,
        'SEQ_DIALECT=' + config.dialect,
        'SEQ_HOST=' + config.host
      ];

      if (!!config.password) {
        env.push('SEQ_PW=' + config.password);
      }

      exec(env.join(' ') + ' ' + cmd + ' down', function (err, stdout) {
        expect(stdout).to.match(new RegExp([
          'Running migrations...',
          'Running migration file 20140105151199-depTest2.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151200-depTest.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151356-usersAddEmail.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Running migration file 20140105151203-userTable.js.done',
          'Executing \\(default\\):.*',
          'Completed in (\\d+)ms',
          'Migrations have run successfully!'
        ].join('\\n')));
        done();
      });
    });

    it('should say no pending migrations after we\'ve migrated...', function (done) {
      exec(cmd + ' -c ./config.js down', function () {
        exec(cmd + ' -c ./config.js down', function (err, stdout) {
          expect(stdout).to.include('There are currently no pending migrations.');
          done();
        });
      });
    });
  });
});
