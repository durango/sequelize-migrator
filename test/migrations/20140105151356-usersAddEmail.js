module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'email', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'email').complete(done);
  }
}
