const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(token) {
    console.log('Secret Key:', config.secretKey);  // Debugging check
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if (err) {
                console.error('Token verification failed:', err);  // Log the error
                return reject(err);  // Reject if there is an error
            }
            resolve(decoded);  // Resolve if successful
        });
    });
}

module.exports = {
    verifyToken
};
