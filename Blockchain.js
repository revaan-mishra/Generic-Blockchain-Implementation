const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class Transactions {
    constructor(fromAddress, ToAddress, amount) {
        this.fromAddress = fromAddress;
        this.ToAddress = ToAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.ToAddress +
            this.amount + this.timestamp).toString();
    };

    signTransactions(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress)
            throw new Error('You cannot Sign transactions from other wallets !!');

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null)
            return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transactions');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
};
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp +
            this.nonce + JSON.stringify(this.transactions)).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined.. " + this.hash);
    }

    hasValidTransaction() {
        for (const tx of this.transactions) {
            if (!tx.isValid())
                return false;
        }
        return true;
    }
};

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningRewards = 100;
    }

    createGenesisBlock() {
        return new Block('01/01/1970', 'Genesis Block', 'NULL');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardsAddress) {

        const rewardTx = new Transactions(null, miningRewardsAddress, this.miningRewards);
        this.pendingTransaction.push(rewardTx);

        const block = new Block(Date.now(), this.pendingTransaction, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block Mined !!");
        this.chain.push(block);

        this.pendingTransaction = [];
    }

    addTransaction(transaction) {

        if (!transaction.fromAddress || !transaction.ToAddress)
            throw new Error('Transaction Must include From and To Addresses');

        if (!transaction.isValid())
            throw new Error('Cannot add invalid Transaction to chain');

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }

        if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
            throw new Error('Not enough balance');
        }

        this.pendingTransaction.push(transaction);
    };

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {

                if (trans.fromAddress === address)
                    balance -= trans.amount;

                if (trans.ToAddress === address)
                    balance += trans.amount;
            }
        }

        return balance;
    }
    getAllTransactionsForWallet(address) {
        const txs = [];

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }
        return txs;
    }

    isChainValid() {

        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];

            if (!currentBlock.hasValidTransaction())
                return false;

            if (currentBlock.hash !== currentBlock.calculateHash())
                return false;
        }
        return true;
    }
};

module.exports.Blockchain = Blockchain;
module.exports.Transactions = Transactions;
module.exports.Block = Block;
