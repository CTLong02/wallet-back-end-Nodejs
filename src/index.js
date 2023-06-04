const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const route = require('./routes');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
route(app);

app.listen(process.env.PORT, () => {
    console.log(`listen port ${process.env.PORT}`);
});
