const database = require("../models");
const { InvalidArgumentError, InternalServerError } = require("../error/error");

const basicItemAuthorizationCheck = (item, access, userId) => {
  //   if (!access.own) return false;
  //   if (item.dataValues.UserId != userId) return false;
  //   return true;
  return false;
};
const basicItemsAuthorizationCheck = (items, access, userId) => {
  //   if (!access.own) return false;
  //   console.log(items);
  //   const authorizedItems = items.filter(
  //     (item) => item.dataValues.UserId == userId
  //   );
  //   return authorizedItems;
  return false;
};

const authorization = {
  addAuthorizationCheck: (item, access, userId) =>
    basicItemAuthorizationCheck(item, access, userId),
  addWithMyUserAuthorizationCheck: (item, access, userId) =>
    basicItemAuthorizationCheck(item, access, userId),
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
    basicItemAuthorizationCheck(item, access, userId),
  listByParamAuthorizationCheck: (items, access, userId) =>
    basicItemsAuthorizationCheck(items, access, userId),
};

module.exports = {
  listWithCities: async (req, res) => {
    try {
      const items = await database.State.findAll({
        include: database.City,
      });
      const userId =
        req.user !== undefined ? req.user.dataValues.id : undefined;
      const anyAccess =
        req.access !== undefined ? req.access.any.granted : false;
      let authorized = anyAccess
        ? items
        : authorization.listByParamAuthorizationCheck(
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
