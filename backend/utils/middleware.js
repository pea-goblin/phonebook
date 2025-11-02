const morgan = require('morgan');
const logger = require('./logger');

const errorHandler = (error, request, response, next) => {

    if (error.name === "CastError") {
        return response.status(400).json({ error: "id is invalid format" });
    } else if (error.name === "ValidationError") {
        const messages = Object.values(error.errors)
            .map((e, i) => {
                return `Error ${e.properties.path}: ${e.message};`
            }).join(' ');

        return response.status(400).json({ error: messages });
    };

    return response.status(500).json({ error: "internal server error" })
}

const unknownEndpoint = (req, res, next) => {
    res.status(404).json({ error: "page is not exist" });
    next();
}

const logRequest = (req, res, next) => {
    morgan.token("body", req => JSON.stringify(req.body));
    const format = ':method :url :status :res[content-length] - :response-time ms :body';
    morgan(format)(req, res, next);
}

module.exports = { errorHandler, unknownEndpoint, logRequest };