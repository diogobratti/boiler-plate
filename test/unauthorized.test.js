const config = require("./config.json");
const { publicPost, publicGet } = require("./Axios");
const { generate } = require("gerador-validador-cpf");
const faker = require("faker");

const getMethodTests = [
  //   {
  //     //   name: "",
  //     url: "",
  //     params: {},
  //     result: {},
  //   },
  {
    url: "/state/listWithCities",
  },
  {
    url: "/category/listWithProvider",
  },
  {
    url: "/category/listWithProvider/1",
  },
  {
    url: "/category/listWithProvider/2",
  },
  {
    url: "/provider/listStarred",
  },
  {
    url: "/provider/listWhereCategory/1",
  },
  {
    url: "/provider/listWhereCategory/2",
  },
  {
    url: "/provider/listByParam/categoryId/1/numberOfRows/30/lastItemId/0",
  },
  {
    url: "/product/listByParam/providerId/1/numberOfRows/30/lastItemId/0",
  },
  {
    url: "/product/listByProvider/1",
  },
  {
    url: "/product/listByProvider/2",
  },
  {
    url: "/productGroup/listWithProductByProvider/1",
  },
  {
    url: "/productGroup/listWithProductByProvider/2",
  },
  {
    url: "/product/listByIds/1,2,3,4",
  },
  {
    url: "/product/listByIds/1",
  },
];
getMethodTests.forEach((element) => {
  test("Testing GET : " + config.PUBLIC_PATH + element.url, async () => {
    const response = await publicGet(element.url);
    // console.log(response);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBeUndefined();
    expect(response.data.length).toBeGreaterThan(0);
  });
});

test("Testing POST : /user/signUp", async () => {
  const response = await publicPost("/user/signUp", {
    StateId: 24,
    id: null,
    street: "Rua Ilha Sul",
    number: "123",
    complement: "apt 456",
    neighborhood: "Campeche",
    zip: "88065290",
    main: true,
    CityId: 4506,
    UserId: null,
    City: { StateId: "" },
    RoleId: null,
    name: faker.name.findName(),
    username: generate(),
    phone: "48987654321",
    email: faker.internet.email(),
    password: config.PASSWORD_TEST,
    allowExtraEmails: true,
    allowExtraWhatsapp: true,
    createdAt: null,
    deletedAt: null,
    termsAccepted: "",
    updatedAt: null,
    Addresses: [
      {
        id: null,
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        zip: "",
        main: true,
        CityId: "",
        UserId: null,
        City: { StateId: "" },
      },
    ],
  });
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(201);
  expect(response.data).not.toBeNull();
  expect(response.data).not.toBeUndefined();
  expect(response.data.accessToken).not.toBeNull();
  expect(response.data.accessToken).not.toBeUndefined();
  expect(response.data.refreshToken).not.toBeNull();
  expect(response.data.refreshToken).not.toBeUndefined();
  expect(response.data.user).not.toBeNull();
  expect(response.data.user).not.toBeUndefined();
});

test("Testing POST : /error/notify", async () => {
  const response = await publicPost("/error/notify", {
    error: "Test",
    localStorage: null,
    url: "test url",
    UserId: 1,
  });
  expect(response).not.toBeNull();
  expect(response).not.toBeUndefined();
  expect(response.status).not.toBeNull();
  expect(response.status).not.toBeUndefined();
  expect(response.status).toBe(201);
});
