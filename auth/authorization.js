const control = require("./accessControl");

const methods = {
  read: {
    any: "readAny",
    own: "readOwn",
  },
  create: {
    any: "createAny",
    own: "createOwn",
  },
  update: {
    any: "updateAny",
    own: "updateOwn",
  },
  remove: {
    any: "deleteAny",
    own: "deleteOwn",
  },
};
module.exports = (entity, action) => (req, res, next) => {
  const role = (req.user !== undefined ? req.user.dataValues.Role.label : "anybody");
  const rolePermissions = control.can(role);
  const actions = methods[action];
  const anyPermission = rolePermissions[actions.any](entity);
  const ownPermission = rolePermissions[actions.own](entity);

  if (anyPermission.granted === false && ownPermission.granted === false) {
    res.status(403);
    res.end();
    return;
  }

  req.access = {
    // any: {
    //   granted: anyPermission.granted,
    //   attributes: anyPermission.attributes,
    // },
    // own: {
    //   granted: ownPermission.granted,
    //   attributes: ownPermission.attributes,
    // },
    any: anyPermission,
    own: ownPermission,
  };

  next();
};
