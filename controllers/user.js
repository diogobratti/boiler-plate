const database = require("../models");
const { InvalidArgumentError, InternalServerError } = require("../error/error");
const tokens = require("../auth/tokens");
const authController = require("./auth");
const { EmailVerification } = require("../email");

function generateURL(route, token) {
  const baseURL = process.env.BASE_URL;
  return `${baseURL}${route}${token}`;
}

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
  addAuthorizationCheck: (item, access, userId) => true,
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
  signUp: async (req, res) => {
    // console.log(req.body);
    try {
      let user = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        allowExtraEmails: req.body.allowExtraEmails,
        allowExtraWhatsapp: req.body.allowExtraWhatsapp,
        termsAccepted: req.body.termsAccepted ? database.NOW : null,
        RoleId: 3, //client
      };
      let address = {
        zip: req.body.zip,
        street: req.body.street,
        number: req.body.number,
        complement: req.body.complement,
        neighborhood: req.body.neighborhood,
        CityId: req.body.CityId,
        main: true,
      };
      const userId =
        req.user !== undefined ? req.user.dataValues.id : undefined;
      let authorized = authorization.addAuthorizationCheck(
        user,
        req.access,
        userId
      );
      const anyAccess = req.access !== undefined ? req.access.any : false;
      if (!anyAccess && authorized === false) {
        res.status(403);
        res.end();
        return;
      }
      let newUser = await database.User.create(user);
      address["UserId"] = newUser.id;
      // console.log(newUser);
      // console.log(address);
      let newAddress = await database.Address.create(address);
      const body = await authController.basicLogin(newUser);

      const token = tokens.emailVerification.create(newUser);
      const urlAddress = generateURL("/auth/verifyEmail/", token);
      const emailVerification = new EmailVerification(newUser, urlAddress);
      emailVerification.sendEmail().catch(console.log);

      res.set("Authorization", body.token);
      res.status(201).json(body);
    } catch (error) {
      console.log(error);
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
