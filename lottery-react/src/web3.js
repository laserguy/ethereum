import Web3 from "web3";

// The assumption here is that there is an associated metamask account here, it won't work without the metamask account
// Just for this project

window.ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3(window.ethereum);

export default web3;
