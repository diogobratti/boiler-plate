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

      let adminAccess = [
        authentication.bearer,
        // authorization.isGlobalAdmin,
        // authorization.isGroupAdmin,
        // authorization.isLocalAdmin,
      ];
      let adminOrMyAccess = [];
      if (model === "user") {
        adminOrMyAccess = [
          authentication.bearer,
          ...adminAccess,
          // authorization.isMyUser,
        ];
      } else if (model === "address") {
        adminOrMyAccess = [
          authentication.bearer,
          ...adminAccess,
          // authorization.isMyAddress,
        ];
        adminAccess = [authentication.bearer];
      } else {
        adminOrMyAccess = [authentication.bearer, ...adminAccess];
      }

      app
        .route(private_path + "/" + model)
        .post(adminAccess, controllers[model].add)
        .get(adminAccess, controllers[model].list);
      app
        .route(private_path + "/" + model + "/withMyUserId")
        .post(adminOrMyAccess, controllers[model].addWithMyUserId)
        .get(adminOrMyAccess, controllers[model].listWithMyUserId);

      app
        .route(private_path + "/" + model + "/:id")
        .delete(adminOrMyAccess, controllers[model].delete)
        .get(adminOrMyAccess, controllers[model].findByPk)
        .put(adminOrMyAccess, controllers[model].update);
      app
        .route(private_path + "/" + model + "/withMyUserId/:id")
        .put(adminOrMyAccess, controllers[model].updateWithMyUserId);
    });
  return routes;
};
