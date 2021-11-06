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
    const Model = model.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join("_");;

    const columns = Object.keys(database[Model].rawAttributes);
    const nonStandardColumns = columns.filter(
      (column) => !standardColumns.includes(column)
    );
    const standardColumnsWithMyUserId = [...standardColumns, "UserId"];
    const nonStandardColumnsWithMyUserId = columns.filter(
      (column) => !standardColumnsWithMyUserId.includes(column)
    );

    const controller = {
      add: async (req, res) => {
        let item = {};
        try {
          for (const column of nonStandardColumns) {
            if (req.body[column] !== undefined) {
              item[column] = req.body[column];
            }
          }
          await database[Model].create(item);
          res.status(201).json();
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
          item["UserId"] = req.user.id;
          await database[Model].create(item);
          res.status(201).json();
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
          for (const column of nonStandardColumnsWithMyUserId) {
            if (req.body[column] !== undefined) {
              item[column] = req.body[column];
            }
          }
          item["UserId"] = req.user.id;
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
        res.json(item);
      },

      list: async (req, res) => {
        const items = await database[Model].findAll();
        res.json(items);
      },

      listWithMyUserId: async (req, res) => {
        const items = await database[Model].findAll({
          where: { userId: req.user.id },
        });
        res.json(items);
      },

      delete: async (req, res) => {
        const item = await database[Model].findByPk(req.params.id);
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
          console.log(options);
          const items = await database[Model].findAll(options);
          res.json(items);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
        }
      },
    };
    controllers[model] = { ...controller, ...controllers[model] };
  });

module.exports = controllers;
