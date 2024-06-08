var jwt = require('jsonwebtoken');
const generateToken = (id) => {
    return jwt.sign({id}, 'shahroz', {
        expiresIn: '30d'
    })
}


module.exports = generateToken;