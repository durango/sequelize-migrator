module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('users', {
      username: DataTypes.STRING,
      password: DataTypes.STRING
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('users').complete(done);
  }
}
