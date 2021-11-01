"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const routes = {};
const controllers = require("../controllers");
const { authentication, authorization } = require("../auth");

const private_path = "/private";

module.exports = (app) => {
  const fileNames = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  });
  fileNames.forEach((file) => {
    routes[file.slice(0, -3)] = require(path.join(__dirname, file))(app);
  });

  /**************************
  Reading all models and inserting CRUD routes 
  ***************************/
  fs.readdirSync(__dirname + "/../models")
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const model = file.slice(0, -3);


      app
        .route(private_path + "/" + model)
        .post([authentication.bearer, authorization(model,'create')], controllers[model].add)
        .get([authentication.bearer, authorization(model,'read')], controllers[model].list);
      app
        .route(private_path + "/" + model + "/withMyUserId")
        .post([authentication.bearer, authorization(model,'create')], controllers[model].addWithMyUserId)
        .get([authentication.bearer, authorization(model,'read')], controllers[model].listWithMyUserId);

      app
        .route(private_path + "/" + model + "/:id")
        .delete([authentication.bearer, authorization(model,'remove')], controllers[model].delete)
        .get([authentication.bearer, authorization(model,'read')], controllers[model].findByPk)
        .put([authentication.bearer, authorization(model,'update')], controllers[model].update);
      app
        .route(private_path + "/" + model + "/withMyUserId/:id")
        .put([authentication.bearer, authorization(model,'update')], controllers[model].updateWithMyUserId);
    });
  return routes;
};
