const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// The compilation of the inbox.sol gives an object which contains multiple information like Bytecode and ABI
// THe bytecode will be used to deploy on the test/actual ethereum network
// ABI interface is used to interact with the deployed contract
module.exports = solc.compile(source, 1).contracts[':Inbox'];
