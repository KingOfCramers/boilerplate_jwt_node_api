// SET PORT
const port = process.env.PORT || 3000;
const dev = port === 3000 ? "development" : "production";

module.exports = {
    dev,
    port
}