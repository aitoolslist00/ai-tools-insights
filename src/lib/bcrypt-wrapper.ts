import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

export const hashSync = bcrypt.hashSync;
export const hash = bcrypt.hash;
export const compareSync = bcrypt.compareSync;
export const compare = bcrypt.compare;
export const genSaltSync = bcrypt.genSaltSync;
export const genSalt = bcrypt.genSalt;
export const getRounds = bcrypt.getRounds;

export default bcrypt;
