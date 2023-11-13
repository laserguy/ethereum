const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const { abi, evm } = require('./compile');

provider = new HDWalletProvider(
  'right pony fantasy domain magic stage hole mouse insect lady heavy dream',
  'https://goerli.infura.io/v3/6b127933f36f47f6a6820ed784f2d0a1'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(abi);
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
