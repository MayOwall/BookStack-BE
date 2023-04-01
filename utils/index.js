require("dotenv/config");
const bcrypt = require("bcrypt");
const { SALT_ROUND } = process.env;

exports.makeHash = async (rawData) =>
  await bcrypt.hash(rawData, Number(SALT_ROUND));
