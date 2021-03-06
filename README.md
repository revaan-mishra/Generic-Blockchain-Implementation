# Generic-Blockchain-Implementation
A very simple blockchain created using Javascript.

All the current implementations of blockchains are tightly coupled with the larger context and problems they (e.g. Bitcoin or Ethereum) are trying to solve. This makes understanding blockchains a necessarily harder task, than it must be. Especially source-code-wise. This project is an attempt to provide as concise and simple implementation of a blockchain as possible.


## Getting Started

### Prerequisites

You need node.js and npm package manager to be installed. I developed this code using node v15.8.0, but should work with previous versions.

### Installation

Go into the code root and install all the packages.

```sh
$ npm install
```



Traditionnal blockchain implemented concepts :

- block chain (data is a list of blocks),
- block validity,
- proof of work (proof of stake can also be implementation as well as other algorithms,



After creating the blockchain try and tamper with it by changing the property of one of the blocks (i.e. amount) and even attempting to recalculate that block's new hash after tampering.

This will demonstrate the blockchain's ability to detect fraud.

This blockchain includes a proof of work mechanism based on a set difficulty value for the number of 0s which a hash for a new block must begin with. The nonce value is changed with each mining attempt to generate a new hash. This mining attempt (in the while loop) stops when an acceptable hash (with correct number of starting 0s) is generated and that valid block is added to the chain.

There is a miner reward system implemented to award coins to miner address and return the "balance" of the miner.

This program maintains a distributed database accross active nodes, interconnected by the network.

Since this is written in Javascript, blockchain nodes can either run on NodeJS or in the browser.
