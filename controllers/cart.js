const database = require("../models");
const { InvalidArgumentError, InternalServerError } = require("../error/error");
const { Op } = require("sequelize");

const basicItemAuthorizationCheck = (item, access, userId) => {
  if (!access.own.granted) return false;
  if (item.dataValues.UserId != userId) return false;
  return true;
};
const basicItemsAuthorizationCheck = (items, access, userId) => {
  if (!access.own) return false;
  const authorizedItems = items.filter(
    (item) => item.dataValues.UserId == userId
  );
  return authorizedItems;
};

const authorization = {
  addAuthorizationCheck: (item, access, userId) =>
    basicItemAuthorizationCheck(item, access, userId),
  addWithMyUserAuthorizationCheck: (item, access, userId) => {
    if (!access.own.granted) return false;
    if (item.UserId != userId) return false;
    return true;
  },
  updateAuthorizationCheck: (item, access, userId) =>
    basicItemAuthorizationCheck(item, access, userId),
  updateWithMyUserIdAuthorizationCheck: (item, access, userId) =>
    basicItemAuthorizationCheck(item, access, userId),
  findByPkAuthorizationCheck: (item, access, userId) =>
    basicItemAuthorizationCheck(item, access, userId),
  listAuthorizationCheck: (items, access, userId) =>
    basicItemsAuthorizationCheck(items, access, userId),
  listWithMyUserIdAuthorizationCheck: (items, access, userId) =>
    basicItemsAuthorizationCheck(items, access, userId),
  deleteAuthorizationCheck: (item, access, userId) =>
    item.length > 1
      ? basicItemsAuthorizationCheck(item, access, userId)
      : basicItemAuthorizationCheck(item, access, userId),
  listByParamAuthorizationCheck: (items, access, userId) =>
    basicItemsAuthorizationCheck(items, access, userId),
};

module.exports = {
  ...authorization,
  clear: async (req, res) => {
    const items = await database.Cart.findAll({
      where: {
        UserId: {
          [Op.eq]: req.user.id,
        },
      },
    });
    try {
      const anyAccess =
        req.access !== undefined ? req.access.any.granted : false;
      let authorized = anyAccess
        ? items
        : authorization.deleteAuthorizationCheck(
            items,
            req.access,
            req.user.dataValues.id
          );
      if (!anyAccess && authorized === false) {
        res.status(403);
        res.end();
        return;
      }
      await authorized.every((item) => item.destroy(item));
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
