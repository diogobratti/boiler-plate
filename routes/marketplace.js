const controllers = require("../controllers");
const { authorization, authentication } = require("../auth");

const private_path = "/private";

module.exports = (app) => {
  // app.route("/checkout").post(authentication.bearer, controllers.marketplace.checkout);
  app.route(private_path + "/cart/clear").post([authentication.bearer, authorization('cart','remove')], controllers.cart.clear);
};
