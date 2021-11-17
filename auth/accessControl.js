const AccessControl = require("accesscontrol");
const control = new AccessControl();

control
  .grant("anybody")
  .readAny("product")
  .readAny("productGroup")
  .readAny("provider")
  .readAny("category")
  .readAny("city")
  .readAny("state")
  .readAny("country")
  .createOwn("user")
  .createOwn("address")
  .readAny("role");
control
  .grant("client")
  .extend("anybody")
  .readOwn("order")
  .createOwn("order")
  .updateOwn("order")
  .readOwn("cart")
  .createOwn("cart")
  .updateOwn("cart")
  .deleteOwn("cart")
  .readOwn("user")
  .readOwn("address")
  .createOwn("address")
  .updateOwn("address")
  .deleteOwn("address");

control
  .grant("seller")
  .extend("client")
  .createOwn("product")
  .updateOwn("product")
  .deleteOwn("product");

control.grant("admin").extend("seller");

module.exports = control;
