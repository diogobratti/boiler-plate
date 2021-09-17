require("dotenv").config();
const app = require("./app");
require("./redis");
const https = require("https");
const fs = require("fs");

const routes = require("./routes");
routes(app);

const port = process.env.PORT ? process.env.PORT : 3333;

if (process.env.NODE_ENV == "production") {
  // Certificate
  const privateKey = fs.readFileSync(
    `${process.env.CERTBOT_FOLDER}/privkey.pem`,
    "utf8"
  );
  const certificate = fs.readFileSync(
    `${process.env.CERTBOT_FOLDER}/cert.pem`,
    "utf8"
  );
  const ca = fs.readFileSync(`${process.env.CERTBOT_FOLDER}/chain.pem`, "utf8");

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  // Starting both http & https servers
  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
  });
} else {
  app.listen(port, () => console.log(`App listening on port ${port}`));
}
