import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x751bC1409E8Ee0248C82c3c26f58CF11114936A2'
);

export default instance;
