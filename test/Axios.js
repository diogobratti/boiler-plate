const axios = require("axios");
const config = require("./config.json");

const Axios = axios.create({
  baseURL: config.BASE_URL,
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  //   'accept' : 'application/json, text/plain, */*'
  // }
});

const publicGet = async (url) => {
  // try {
  return await Axios.get(config.PUBLIC_PATH + url);
  // } catch (error) {
  //   console.log(error);
  // }
};
const publicPost = async (url, params) => {
  // try {
  return await Axios.post(config.PUBLIC_PATH + url, params);
  // } catch (error) {
  //   console.log(error);
  // }
};

const login = async (username = config.USERNAME_TEST, password = config.PASSWORD_TEST) => {
  // try {
  return await Axios.post("auth/login", {
    username: username,
    password: password,
  });
  // } catch (error) {
  //   console.log(error);
  // }
};
const authenticatedGet = async (
  url,
  username = config.USERNAME_TEST,
  password = config.PASSWORD_TEST
) => {
  // try {
  const authorization = await login(username, password);
  const headers = { Authorization: "Bearer " + authorization.data.accessToken };
  // console.log(headers);
  return await Axios.get(url, { headers: headers });
  // } catch (error) {
  //   console.log(error);
  // }
};
const authenticatedPostAccessToken = async (
  url,
  params,
  username = config.USERNAME_TEST,
  password = config.PASSWORD_TEST
) => {
  // try {
  const authorization = await login(username, password);
  const headers = { Authorization: "Bearer " + authorization.data.accessToken };
  return await Axios.post(url, params, {
    headers: headers,
  });
  // } catch (error) {
  //   console.log(error);
  // }
};
const authenticatedPutAccessToken = async (
  url,
  params,
  username = config.USERNAME_TEST,
  password = config.PASSWORD_TEST
) => {
  // try {
  const authorization = await login(username, password);
  const headers = { Authorization: "Bearer " + authorization.data.accessToken };
  return await Axios.put(url, params, {
    headers: headers,
  });
  // } catch (error) {
  //   console.log(error);
  // }
};
const authenticatedDeleteAccessToken = async (
  url,
  username = config.USERNAME_TEST,
  password = config.PASSWORD_TEST
) => {
  // try {
  const authorization = await login(username, password);
  const headers = { Authorization: "Bearer " + authorization.data.accessToken };
  return await Axios.delete(url, {
    headers: headers,
  });
  // } catch (error) {
  //   console.log(error);
  // }
};
const authenticatedPostRefreshToken = async (
  url,
  params,
  username = config.USERNAME_TEST,
  password = config.PASSWORD_TEST
) => {
  // try {
  const authorization = await login(username, password);
  // console.log(authorization)
  const body = { token: authorization.data.refreshToken, ...params };
  // console.log(body);
  return await Axios.post(url, body);
  // } catch (error) {
  //   console.log(error);
  // }
};
module.exports = {
  Axios: Axios,
  publicGet: publicGet,
  publicPost: publicPost,
  login: login,
  authenticatedPostAccessToken: authenticatedPostAccessToken,
  authenticatedPutAccessToken: authenticatedPutAccessToken,
  authenticatedDeleteAccessToken: authenticatedDeleteAccessToken,
  authenticatedPostRefreshToken: authenticatedPostRefreshToken,
  authenticatedGet: authenticatedGet,
};
