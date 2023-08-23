const bcrypt = require("bcrypt");

module.exports.validateUser = async (password,hash)=> {
  await bcrypt
    .compare(password, hash)
    .then((res) => {
      console.log(res); // return true
      return res;
    })
    .catch((err) => console.error(err.message));
}

