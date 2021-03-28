const { Blockchain, Transactions } = require('./Blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('64ead35b9564c2d1f720e52d0efb8d3abe2382e74f8791a0a192ca176de724a3');
const myWalletAddress = myKey.getPublic('hex');

const Creds = new Blockchain();
``
Creds.minePendingTransactions(myWalletAddress);

const tx1 = new Transactions(myWalletAddress, 'address2', 100);
tx1.signTransactions(myKey);
Creds.addTransaction(tx1);

Creds.minePendingTransactions(myWalletAddress);

const tx2 = new Transactions(myWalletAddress, 'address1', 50);
tx2.signTransactions(myKey);
Creds.addTransaction(tx2);

Creds.minePendingTransactions(myWalletAddress);

console.log();
console.log(`Balance of Miner is ${Creds.getBalanceOfAddress(myWalletAddress)}`);

// Uncomment this line if you want to test tampering with the chain
// Creds.chain[1].transactions[0].amount = 10;

console.log();
console.log('Blockchain valid?', Creds.isChainValid() ? 'Yes' : 'No');