module.exports = {
  deps: [
    '20140105151356-usersAddEmail-assets'
  ],
  up: function(migration, DataTypes, done) {
    migration.addColumn('userAssets', 'test', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('userAssets', 'test').complete(done);
  }
}
