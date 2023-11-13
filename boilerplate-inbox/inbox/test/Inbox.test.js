const assert = require('assert');
/*
The ganche will create a local test ethereum network where we can run our local test and deployment
To write anything in a blockchain, we have to do a transaction, and deploy a contract we have to make a contract transaction
And in contract transaction, or any transaction we have to provide the information of the sender(account)
ganache will also create some accounts for us which we can use
ganache creates the unlocked account
meaning of unlocked means that we don't need keys here(no keys are associated with the account)
*/
const ganache = require('ganache-cli');
const { send } = require('process');

/*
The Web3 is in named in capital because Web3 here is a class
To instantiate we will use web3(small case)
*/
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

/*
See compile.js file in case of any confusion, compile.js on compilation returns the object which contains
interface(ABI) and bytecodes come from the compilation, and we have to use the name in same way */
const { interface, bytecode } = require('../compile');

/*
Here we will use Mocha test framework to run our tests
Mocha as 3 functions
it = Run a test and make an assertion
describe = Groups together 'it' functions
beforeEach = Execute some general setup code. (like init before we start executing the each tests)
 */

let accounts;
let inbox;
const INITIAL_STRING = 'HI there!';

beforeEach(async () => {
  /*
  The contract has to be deployed before we run any tests, -.-
  Therefore deployment to local test network will come in the beforeEach section
  Get a list of all accounts
  Every function in web3 is async in nature, so it going to return a PROMISE
   */
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract

  /*
    Meaning of each line in the deployment process
    web3 is used deploy contracts and interact with contracts on web3 decentralized networks(at the moment its only ethereum)
    web3.eth - using ethereum network
    web3.eth.Contract - the 'C' is capital in contract means that a class and we are instantiating it to get an object
    web3.eth.Contract(JSON.parse(interface)) - interface comes from compile.js and we need JSON notation of that
    *.deploy(data:bytecode,arguments:[params]) - bytecode comes from compile.js and arguments are the parameters(, separated) for the contract constructor
    deploy doesn't deploy the contract, just creates the object for the deployment
    *.send(from: account,gas:<number>) - which account to use for the deployment and give the gas limit
  */
  // YOU CAN PRINT inbox, IN CASE U WANT TO CHECK THE OUTPUT OF THE DEPLOYMENT
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING], // We have to give a default message for our contract constructor
    })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    /*
    After deploying the contract, we checked on the console, we get some info about the contract
    options is one of the field in the deployed contract and address is part of it. We need address of the contract to interact with the contract
     */

    //console.log(inbox);
    // if there is a value in the inbox.options.address then it will work otherwise it asserts
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    /*
    We get `methods`(section in the deployed contract which contain contract functions/methods) which are tied to the contract,
    after deploying the contract, as we saw in the console
    Below is the syntax to call contract methods
     */
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  it('Message modified properly', async () => {
    /*
     RUNNING CONTRACT FUNCTIONS
     1 - 'Calling' a function
        Cannot modify the data on the blockchain, just read and return data. Runs instantly and free to use.
     2 - Sending a transaction to a function
        All the functions which are writing on to the blockchain, remember contract is deployed on the blockchain and do any operations especially
        write we have to pay.
        Therefore these calls are transactions which modify's a contract data. Takes time to execute and returns the transaction hash
        IMPORTANT
        We cannot return anything from a function which is writing on the blockchain, syntactically it won't cause any trouble but we might cause
        problem during the runtime. We cannot return anything because it will automatically return the transaction hash.
     */
    /*
        Meaning of the below syntax
        See when we are just calling the function we are using .call()
        When we are writing on blockchain, we are using .send()
     */
    await inbox.methods.setMessage('Bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Bye');
  });
});
