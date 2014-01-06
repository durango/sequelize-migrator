module.exports = {
  deps: [
    'depTest'
  ],
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'test2', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'test2').complete(done);
  }
}
