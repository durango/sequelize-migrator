module.exports = {
  deps: [
    'usersAddEmail'
  ],
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'test', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'test').complete(done);
  }
}
