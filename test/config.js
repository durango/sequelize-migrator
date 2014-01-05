module.exports = {
  username: process.env.SEQ_USER || "root",
  password: process.env.SEQ_PW   || null,
  database: process.env.SEQ_DB   || 'sequelize_test',
  host:     process.env.SEQ_HOST || '127.0.0.1',
  dialect:  process.env.SEQ_DIALECT || 'mysql',
  logging:  console.log
}
