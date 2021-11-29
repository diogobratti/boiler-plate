const controllers = require("../controllers");
const { authorization, authentication } = require("../auth");
const upload = require("../config/multer");

const private_path = "/private";

module.exports = (app) => {
  // app.route("/checkout").post(authentication.bearer, controllers.marketplace.checkout);
  app
    .route(private_path + "/cart/clear")
    .post(
      [authentication.bearer, authorization("cart", "remove")],
      controllers.cart.clear
    );
  app.route(private_path + "/product/testingSendPicture").post(
    [
      authentication.bearer,
      authorization("product", "create"),
      upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "gallery", maxCount: 8 },
      ]),
    ],
    (req, res) => res.end("File is uploaded")
  );
};
