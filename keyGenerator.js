const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const PublicKey = key.getPublic('hex');
const PrivateKey = key.getPrivate('hex');

console.log();
console.log('Private Key: ' + PrivateKey);

console.log();
console.log('Public Key: ' + PublicKey);

// Private Key: 64ead35b9564c2d1f720e52d0efb8d3abe2382e74f8791a0a192ca176de724a3

// Public Key: 04ee9ff3099bef3983289e47189733d02028c1dc73106fb7d70ee994803d874834520c1631446dd3001e50d47e435ee7e8d4efff712f9a7c51840ce6f24da1e910