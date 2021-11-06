require('dotenv').config();
const fs = require('fs');

module.exports = {
  "define": {
    "underscored": false,
    "charset": "utf8",
    "dialectOptions": {
      "collate": "utf8_general_ci"
    },
    "timestamps": true,
    "createdAt": "createdAt",
    "updatedAt": "updatedAt",
    "deletedAt": "deletedAt",
    "createdBy": "createdBy",
    "updatedBy": "updatedBy",
    "deletedBy": "deletedBy"
  },
  "development": {
    "username": process.env.DEV_DB_USERNAME,
    "password": process.env.DEV_DB_PASSWORD,
    "database": process.env.DEV_DB_NAME,
    "host": process.env.DEV_DB_HOSTNAME,
    "port": process.env.DEV_DB_PORT,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.CI_DB_USERNAME,
    "password": process.env.CI_DB_PASSWORD,
    "database": process.env.CI_DB_NAME,
    "host": process.env.CI_DB_HOSTNAME,
    "port": process.env.CI_DB_PORT,
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.PROD_DB_USERNAME,
    "password": process.env.PROD_DB_PASSWORD,
    "database": process.env.PROD_DB_NAME,
    "host": process.env.PROD_DB_HOSTNAME,
    "port": process.env.PROD_DB_PORT,
    "dialect": "mysql"
  }
};
