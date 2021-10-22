const config = require("./config.json");
const database = require("../models");
const tokens = require("../auth/tokens");
const {
  Axios,
  login,
  authenticatedGet,
  publicPost,
  authenticatedPostRefreshToken,
  authenticatedPostAccessToken,
  authenticatedPutAccessToken,
  authenticatedDeleteAccessToken,
} = require("./Axios");
const i18n = require("../i18n/texts");
const allowlistRefreshToken = require("../redis/allowlistRefreshToken");
// test("add to cart ", async () => {
//   jest.setTimeout(30000);
//   const response = await login(config.USERNAME_TEST, config.PASSWORD_TEST);
//   expect(response).not.toBeNull();
//   expect(response).not.toBeUndefined();
//   expect(response.data).not.toBeNull();
//   expect(response.data).not.toBeUndefined();
//   expect(response.data.accessToken).not.toBeNull();
//   expect(response.data.accessToken).not.toBeUndefined();
//   expect(response.data.refreshToken).not.toBeNull();
//   expect(response.data.refreshToken).not.toBeUndefined();
//   expect(response.data.user).not.toBeNull();
//   expect(response.data.user).not.toBeUndefined();
// });

test("add to cart authenticated ", async () => {
  jest.setTimeout(30000);
  const response = await authenticatedPostAccessToken(
    "/private/cart/WithMyUserId",
    {
      ProductId: 4,
      quantity: 3,
      observation: "Extra picles",
    }
  );
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(201);
});
test("add to cart authenticated 2 ", async () => {
  jest.setTimeout(30000);
  const response = await authenticatedPostAccessToken(
    "/private/cart/WithMyUserId",
    {
      ProductId: 1,
      quantity: 1,
      observation: "",
    }
  );
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(201);
});
test("list cart authenticated ", async () => {
  jest.setTimeout(30000);
  const response = await authenticatedGet("/private/cart/WithMyUserId");
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(200);
});
test("update cart item authenticated ", async () => {
  jest.setTimeout(30000);
  const response = await authenticatedPutAccessToken("/private/cart/1", {
    ProductId: 4,
    quantity: 13,
    observation: "No cheese",
  });
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(204);
});
test("delete cart item authenticated ", async () => {
  jest.setTimeout(30000);
  const response = await authenticatedDeleteAccessToken("/private/cart/1");
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(200);
});
test("clear cart authenticated ", async () => {
  jest.setTimeout(30000);
  const response = await authenticatedPostAccessToken("/private/cart/clear");
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(200);
  authenticatedPostAccessToken(
    "/private/cart/WithMyUserId",
    {
      ProductId: 4,
      quantity: 3,
      observation: "Extra picles",
    }
  );
  authenticatedPostAccessToken(
    "/private/cart/WithMyUserId",
    {
      ProductId: 4,
      quantity: 5,
      observation: "No cheese",
    }
  );
});
