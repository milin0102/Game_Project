const bcrypt = require("bcrypt");
const crypto = require('crypto');
const saltRounds = 10;
const initialization_vector = "X05IGQ5qdBnIqAWD"; 

module.exports = {
    getBcryptPassword: function (password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);
        return hashPassword;
    },
    comparePassword: function (input_password, hashPassword) {

        return bcrypt.compareSync(input_password, hashPassword);
    },
    encryptUserId : function(userId){
        console.log(process.env.CRYPTO_SECRET_KEY)
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_SECRET_KEY) , Buffer.from(initialization_vector))
        let encrypted = cipher.update(userId.toString(), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },
    decryptUserId : function(encryptedUserId){
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_SECRET_KEY) , Buffer.from(initialization_vector));
        let decrypted = decipher.update(encryptedUserId, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }


}