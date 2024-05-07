const bcrypt = require("bcryptjs");

const hash = (plain) => bcrypt.hashSync(plain);

const compare = (plain, hash) => bcrypt.compareSync(plain, hash);

module.exports = {
  hash,
  compare,
};
