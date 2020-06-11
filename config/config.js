require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
  production: {
    JAWSDB_URL: "mysql://nx11bchkqv5hujzs:f5uhgc6dc5hyau1x@ipobfcpvprjpmdo9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/zpdkmn5jiayztj9b",
    dialect: "mysql",
  },
};
