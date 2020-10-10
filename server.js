require('dotenv').config();
const app = require('./app');
const model = require('./models');
require('./redis/blacklist')


const port = (process.env.PORT ? process.env.PORT : 3000);

const routes = require('./routes');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
