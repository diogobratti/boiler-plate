const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokens = require("./tokens");

const { InvalidArgumentError } = require("../error/error");
const model = require("../models");
// const blacklist = require("../redis/blacklist-actions");
const { blocklistAccessToken } = require("../redis");
const i18n = require("../i18n/texts");

function verifyUser(user) {
  if (user === null) {
    throw new InvalidArgumentError(i18n.USER_NOT_FOUND);
  }
}

// async function existsTokenInBlacklist(token) {
//   const tokenNaBlacklist = await blacklist.existsToken(token);
//   if (tokenNaBlacklist) {
//     throw new jwt.JsonWebTokenError(i18n.TOKEN_INVALID);
//   }
// }
async function existsTokenInBlocklistAccessToken(token) {
  const tokenNaBlocklistAccessToken = await blocklistAccessToken.hasToken(
    token
  );
  console.log(tokenNaBlocklistAccessToken);
  if (tokenNaBlocklistAccessToken) {
    throw new jwt.JsonWebTokenError(i18n.TOKEN_INVALID);
  }
}

async function verifyPassword(password, passwordHash) {
  const validPassword = await bcrypt.compare(password, passwordHash);
  if (!validPassword) {
    throw new InvalidArgumentError(i18n.LOGIN_INVALID);
  }
}

passport.use(
  new LocalStrategy(
    {
      // usernameField: 'username',
      // passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {
        const user = await model.User.findOne({
          include: [ model.Role, model.Address ],
          // attributes : [ 'id', 'name', 'email', 'username', 'password', 'RoleId' ],
          where: { username: username },
        });
        verifyUser(user);
        await verifyPassword(password, user.password);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const id = await tokens.access.verify(token);
      const user = await model.User.findByPk(id, {
        include: [ model.Role, model.Address ],
      });
      done(null, user, { token: token });
    } catch (error) {
      done(error);
    }
  })
);
