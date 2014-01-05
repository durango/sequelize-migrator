module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('userAssets', 'email', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('userAssets', 'email').complete(done);
  }
}
