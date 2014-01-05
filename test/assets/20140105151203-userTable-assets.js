module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('userAssets', {
      username: DataTypes.STRING,
      password: DataTypes.STRING
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('userAssets').complete(done);
  }
}
