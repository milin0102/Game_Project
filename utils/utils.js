const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
    getBcryptPassword: function (password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);
        return hashPassword;
    },
    comparePassword: function (input_password, hashPassword) {

        return bcrypt.compareSync(input_password, hashPassword);
    }
}