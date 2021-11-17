const controllers = require("../controllers");
const { authorization } = require("../auth");
const public_path = "/public";
module.exports = (app) => {
  app.route(public_path + "/user/signUp").post(controllers.user.signUp);
  app.route(public_path + "/error/notify").post(controllers.error.notify);
  app.route(public_path + "/address/getZip").get(controllers.address.getZip);
  app
    .route(public_path + "/state/listWithCities")
    .get(authorization('state','read'), controllers.state.listWithCities);

  app
    .route(public_path + "/category/listWithProvider/:id")
    .get(authorization('category','read'), controllers.category.listWithProvider);
  app
    .route(public_path + "/category/listWithProvider")
    .get(authorization('category','read'), controllers.category.listWithProvider);

  app
    .route(public_path + "/provider/listStarred")
    .get(authorization('provider','read'), controllers.provider.listStarred);

  app
    .route(public_path + "/provider/listWhereCategory/:categoryId")
    .get(authorization('provider','read'), controllers.provider.listWhereCategory);
  app
    .route(
      public_path +
        "/provider/listByParam/:param/:paramValue/numberOfRows/:numberOfRows/lastItemId/:lastItemId"
    )
    .get(authorization('provider','read'), controllers.provider.listByParam);

  app
    .route(
      public_path +
        "/product/listByParam/:param/:paramValue/numberOfRows/:numberOfRows/lastItemId/:lastItemId"
    )
    .get(authorization('product','read'), controllers.product.listByParam);
    app
      .route(public_path + "/product/listByIds/:productIds")
      .get(authorization('product','read'), controllers.product.listByIds);
  app
    .route(public_path + "/product/listByProvider/:providerId")
    .get(authorization('product','read'), controllers.product.listByProvider);

    app
    .route(public_path + "/productGroup/listWithProductByProvider/:providerId")
    .get(authorization('product','read'), controllers.productGroup.listWithProductByProvider);
};
