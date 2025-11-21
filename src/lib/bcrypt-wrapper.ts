import bcryptjs from 'bcryptjs';

export default bcryptjs;
export const hashSync = bcryptjs.hashSync;
export const hash = bcryptjs.hash;
export const compareSync = bcryptjs.compareSync;
export const compare = bcryptjs.compare;
export const genSaltSync = bcryptjs.genSaltSync;
export const genSalt = bcryptjs.genSalt;
export const getRounds = bcryptjs.getRounds;
