// Copyright 2020 Precision Electric Motor Sales

module.exports = async (client, error) => {
    client.logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
};