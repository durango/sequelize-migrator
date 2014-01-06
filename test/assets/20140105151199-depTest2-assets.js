module.exports = {
  deps: [
    '20140105151200-depTest-assets'
  ],
  up: function(migration, DataTypes, done) {
    migration.addColumn('userAssets', 'test2', DataTypes.STRING).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('userAssets', 'test2').complete(done);
  }
}
