const config = require('./utils/config');
const mongoose = require('mongoose');
const express = require("express");
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const personRouter = require('./controllers/persons');

const app = express();

mongoose.connect(config.MONGODB_URI)
    .then(r => {
        logger.info("Connected to db");
    })
    .catch(e => {
        logger.error("error connect to db:", e.message);
    });
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.logRequest);

app.use('/', personRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;