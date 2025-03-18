const jwt = require('jsonwebtoken');

// Your secret key (this must match the server's secret key)
const secretKey = `2254d5476a84672ba55fb7597eb0e957c28acf98885387c2dba17239f3a5cb20`;

// Timestamp string (this is the string to sign exactly as the error message says)
const timestamp = 1742088413;
const stringToSign = `timestamp=${timestamp}`;

// To create the JWT, we need to sign the string `timestamp=1742088413`
const signature = jwt.sign(stringToSign, secretKey, { algorithm: 'HS256' });

console.log(`Generated JWT: ${signature}`);
