const database = require("../models");
const { InvalidArgumentError, InternalServerError } = require("../error/error");
const { Op } = require("sequelize");

module.exports = {
  clear: async (req, res) => {
    const items = await database.Cart.findAll({
      where: {
        UserId: {
          [Op.eq]: req.user.id
        }
      }
    });
    try {
      await items.every(item => item.destroy(item));
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
