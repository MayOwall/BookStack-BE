require("dotenv/config");
const bcrypt = require("bcrypt");
const { SALT_ROUND } = process.env;

// Data => Hash 핸들러
exports.makeHash = async (rawData) =>
  await bcrypt.hash(rawData, Number(SALT_ROUND));

// Hash 일치 여부 판단 핸들러
exports.compareHash = async (data, hash) => await bcrypt.compare(data, hash);
