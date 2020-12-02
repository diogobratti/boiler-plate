const database = require("../models");
const { InvalidArgumentError, InternalServerError } = require("../error/error");

module.exports = {
  listByProvider: async (req, res) => {
    try {
      const products = await database.Product.findAll({
        include: [database.ProductGroup],
        where: { providerId: req.params.providerId },
      });
      res.json(products);
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
};
