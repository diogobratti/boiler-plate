"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const database = require("./../models");
const { Op } = require("sequelize");
const controllers = {};
const { InvalidArgumentError, InternalServerError } = require("../error/error");

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    controllers[file.slice(0, -3)] = require(path.join(__dirname, file));
  });

/**************************
  Reading all models and inserting CRUD routes 
  ***************************/

const standardColumns = ["id", "createdAt", "updatedAt", "deletedAt"];

fs.readdirSync(__dirname + "/../models")
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = file.slice(0, -3);
    const Model = model
      .split("_")
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join("_");

    const columns = Object.keys(database[Model].rawAttributes);
    const nonStandardColumns = columns.filter(
      (column) => !standardColumns.includes(column)
    );
    const standardColumnsWithMyUserId = [...standardColumns, "UserId"];
    const nonStandardColumnsWithMyUserId = columns.filter(
      (column) => !standardColumnsWithMyUserId.includes(column)
    );
    controllers[model] = {
      addAuthorizationCheck: (item, access, userId) => false,
      addWithMyUserAuthorizationCheck: (item, access, userId) => false,
      updateAuthorizationCheck: (item, access, userId) => false,
      updateWithMyUserIdAuthorizationCheck: (item, access, userId) => false,
      findByPkAuthorizationCheck: (item, access, userId) => false,
      //return false or items that can be listed
      listAuthorizationCheck: (items, access, userId) => false,
      //return false or items that can be listed
      listWithMyUserIdAuthorizationCheck: (items, access, userId) => false,
      deleteAuthorizationCheck: (item, access, userId) => false,
      //return false or items that can be listed
      listByParamAuthorizationCheck: (items, access, userId) => false,
      ...controllers[model],
    };
    //TODO: verificar se os dados sao do dono (auth accesscontrol) https://github.com/onury/accesscontrol/issues/14#issuecomment-328316670
    const controller = {
      add: async (req, res) => {
        let item = {};
        try {
          for (const column of nonStandardColumns) {
            if (req.body[column] !== undefined) {
              item[column] = req.body[column];
            }
          }
          const userId =
            req.user !== undefined ? req.user.dataValues.id : undefined;
          const anyAccess =
            req.access !== undefined ? req.access.any.granted : false;
          let authorized = anyAccess
            ? item
            : controllers[model].addAuthorizationCheck(
                item,
                req.access,
                userId
              );
          if (!anyAccess && authorized === false) {
            res.status(403);
            res.end();
            return;
          }
          const newItem = await database[Model].create(item);
          res.status(201).json(newItem);
        } catch (error) {
          if (error instanceof InvalidArgumentError) {
            res.status(422).json({ error: error.message });
          } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
          } else {
            res.status(500).json({ error: error.message });
          }
        }
      },
      /**
       * Same as add, but logged user is used as UserId.
       * @param {*} req
       * @param {*} res
       */
      addWithMyUserId: async (req, res) => {
        let item = {};
        try {
          for (const column of nonStandardColumnsWithMyUserId) {
            if (req.body[column] !== undefined) {
              item[column] = req.body[column];
            }
          }
          const userId =
            req.user !== undefined ? req.user.dataValues.id : undefined;
          item["UserId"] = userId;
          const anyAccess =
            req.access !== undefined ? req.access.any.granted : false;
          let authorized = anyAccess
            ? item
            : controllers[model].addWithMyUserAuthorizationCheck(
                item,
                req.access,
                userId
              );
          if (!anyAccess && authorized === false) {
            res.status(403);
            res.end();
            return;
          }
          const newItem = await database[Model].create(item);
          res.status(201).json(newItem);
        } catch (error) {
          if (error instanceof InvalidArgumentError) {
            res.status(422).json({ error: error.message });
          } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
          } else {
            res.status(500).json({ error: error.message });
          }
        }
      },

      update: async (req, res) => {
        try {
          const item = await database[Model].findByPk(req.params.id);
          const userId =
            req.user !== undefined ? req.user.dataValues.id : undefined;
          const anyAccess =
            req.access !== undefined ? req.access.any.granted : false;
          let authorized = anyAccess
            ? item
            : controllers[model].updateAuthorizationCheck(
                item,
                req.access,
                userId
              );
          if (!anyAccess && authorized === false) {
            res.status(403);
            res.end();
            return;
          }
          for (const column of nonStandardColumns) {
            if (req.body[column] !== undefined) {
              item[column] = req.body[column];
            }
          }
          await item.save();
          res.status(204).json();
        } catch (error) {
          if (error instanceof InvalidArgumentError) {
            res.status(422).json({ error: error.message });
          } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
          } else {
            res.status(500).json({ error: error.message });
          }
        }
      },

      /**
       * Same as update, but logged user is used as UserId.
       * @param {*} req
       * @param {*} res
       */
      updateWithMyUserId: async (req, res) => {
        try {
          const item = await database[Model].findByPk(req.params.id);
          const userId =
            req.user !== undefined ? req.user.dataValues.id : undefined;
          const anyAccess =
            req.access !== undefined ? req.access.any.granted : false;
          let authorized = anyAccess
            ? item
            : controllers[model].updateWithMyUserIdAuthorizationCheck(
                item,
                req.access,
                userId
              );
          if (!anyAccess && authorized === false) {
            res.status(403);
            res.end();
            return;
          }
          for (const column of nonStandardColumnsWithMyUserId) {
            if (req.body[column] !== undefined) {
              item[column] = req.body[column];
            }
          }
          item["UserId"] = userId;
          await item.save();
          res.status(204).json();
        } catch (error) {
          if (error instanceof InvalidArgumentError) {
            res.status(422).json({ error: error.message });
          } else if (error instanceof InternalServerError) {
            res.status(500).json({ error: error.message });
          } else {
            res.status(500).json({ error: error.message });
          }
        }
      },

      findByPk: async (req, res) => {
        const item = await database[Model].findByPk(req.params.id);
        const userId =
          req.user !== undefined ? req.user.dataValues.id : undefined;
        const anyAccess =
          req.access !== undefined ? req.access.any.granted : false;
        let authorized = anyAccess
          ? item
          : controllers[model].findByPkAuthorizationCheck(
              item,
              req.access,
              userId
            );
        if (!anyAccess && authorized === false) {
          res.status(403);
          res.end();
          return;
        }
        res.json(item);
      },

      list: async (req, res) => {
        const items = await database[Model].findAll();
        const userId =
          req.user !== undefined ? req.user.dataValues.id : undefined;
        const anyAccess =
          req.access !== undefined ? req.access.any.granted : false;
        let authorized = anyAccess
          ? items
          : controllers[model].listAuthorizationCheck(
              items,
              req.access,
              userId
            );
        if (!anyAccess && authorized === false) {
          res.status(403);
          res.end();
          return;
        }
        res.json(authorized);
      },

      listWithMyUserId: async (req, res) => {
        const items = await database[Model].findAll({
          where: { userId: req.user.id },
        });
        const userId =
          req.user !== undefined ? req.user.dataValues.id : undefined;
        const anyAccess =
          req.access !== undefined ? req.access.any.granted : false;
        let authorized = anyAccess
          ? items
          : controllers[model].listWithMyUserIdAuthorizationCheck(
              items,
              req.access,
              userId
            );
        if (!anyAccess && authorized === false) {
          res.status(403);
          res.end();
          return;
        }
        res.json(authorized);
      },

      delete: async (req, res) => {
        const item = await database[Model].findByPk(req.params.id);
        const userId =
          req.user !== undefined ? req.user.dataValues.id : undefined;
        const anyAccess =
          req.access !== undefined ? req.access.any.granted : false;
        let authorized = anyAccess
          ? item
          : controllers[model].deleteAuthorizationCheck(
              item,
              req.access,
              userId
            );
        if (!anyAccess && authorized === false) {
          res.status(403);
          res.end();
          return;
        }
        try {
          await item.destroy(item);
          res.status(200).send();
        } catch (error) {
          res.status(500).json({ error: error });
        }
      },

      /**
       * This method intend to paginated list all items, ordered by id, filtered by some param.
       * Maximum page size is 100.
       * @param param
       * @param paramValue
       * @param numberOfRows
       * @param lastItemId
       *
       * Example on GET "localhost:3333/public/product/listByParam/categoryId/3/numberOfRows/10/lastItemId/0"
       * It will return all products of category 3, paginated by 10 rows, starting at the beggining.
       */
      listByParam: async (req, res) => {
        try {
          const { param, paramValue, numberOfRows, lastItemId } = req.params;
          let options = {
            where: {
              [Op.and]: [
                { [param]: paramValue },
                { id: { [Op.gt]: lastItemId } },
              ],
            },
            order: [["id", "ASC"]],
            limit: numberOfRows > 100 ? numberOfRows : 100,
          };
          if (param.endsWith("Id")) {
            const paramModel =
              param.substring(0, 1).toLocaleUpperCase() +
              param.substring(1, param.length - 2);
            options["include"] = [database[paramModel]];
          }
          const items = await database[Model].findAll(options);
          const userId =
            req.user !== undefined ? req.user.dataValues.id : undefined;
          const anyAccess =
            req.access !== undefined ? req.access.any.granted : false;
          let authorized = anyAccess
            ? items
            : controllers[model].listByParamAuthorizationCheck(
                items,
                req.access,
                userId
              );
          if (!anyAccess && authorized === false) {
            res.status(403);
            res.end();
            return;
          }
          res.json(authorized);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
        }
      },
    };
    controllers[model] = { ...controller, ...controllers[model] };
  });

module.exports = controllers;
