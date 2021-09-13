const controllers = require("../controllers");
const public_path = "/public";
module.exports = (app) => {
  app.route(public_path + "/user/signUp").post(controllers.user.signUp);
  app.route(public_path + "/error/notify").post(controllers.error.notify);
  app.route(public_path + "/address/getZip").get(controllers.address.getZip);
  app
    .route(public_path + "/state/listWithCities")
    .get(controllers.state.listWithCities);

  app
    .route(public_path + "/category/listWithProvider/:id")
    .get(controllers.category.listWithProvider);
  app
    .route(public_path + "/category/listWithProvider")
    .get(controllers.category.listWithProvider);

  app
    .route(public_path + "/provider/listStarred")
    .get(controllers.provider.listStarred);

  app
    .route(public_path + "/provider/listWhereCategory/:categoryId")
    .get(controllers.provider.listWhereCategory);
  app
    .route(
      public_path +
        "/provider/listByParam/:param/:paramValue/numberOfRows/:numberOfRows/lastItemId/:lastItemId"
    )
    .get(controllers.provider.listByParam);

  app
    .route(
      public_path +
        "/product/listByParam/:param/:paramValue/numberOfRows/:numberOfRows/lastItemId/:lastItemId"
    )
    .get(controllers.product.listByParam);
    app
      .route(public_path + "/product/listByIds/:productIds")
      .get(controllers.product.listByIds);
  app
    .route(public_path + "/product/listByProvider/:providerId")
    .get(controllers.product.listByProvider);

  app
    .route(public_path + "/productGroup/listWithProductByProvider/:providerId")
    .get(controllers.productGroup.listWithProductByProvider);
};
