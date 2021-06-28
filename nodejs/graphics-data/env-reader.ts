import * as dotenv from 'dotenv';
const result = dotenv.config();
const { parsed: envs } = result;
module.exports = envs;