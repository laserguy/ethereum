// This is for deploying to the public network like Goreli
/*
    In case of local test network created by ganache, it was giving us the providers with unlocked accounts
    Provider was connecting to the test network using an account

    For public networks (Below is how the flow goes)

    Public Network => Infura API => Provider => web3
                                       |
                                  Neumonic phrase

    There are Infura nodes in the etherum based public blockchains(main or test), with Infura API we can connect to these nodes in the blockchain
    To use Infura API we need provider(For which we will need an account, one we created in the metamask)
    This provider will use neumonic(As these will get the keys) to connect to infuraAPI
*/
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode } = require('./compile');

/**
 The first parameter is neumonic and second is link to the network
 Usually we pass these secret keys as environment variables, but this account is for the learning, so passing here directly
 The link comes from the infura.io (Everything goes through infura API)
 */
const provider = new HDWalletProvider(
  'right pony fantasy domain magic stage hole mouse insect lady heavy dream',
  'https://goerli.infura.io/v3/6b127933f36f47f6a6820ed784f2d0a1'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi There'] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to ', result.options.address);
};

deploy();
