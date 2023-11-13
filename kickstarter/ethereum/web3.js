import Web3 from 'web3';

/*
 ANOTHER REASON TO USE Next.js

 For lottery project we used create-react app as a boiler plate, we wrote our code in that and create react was rendered on the browser.
 Here first our code is executed on the "Next" server(We call this Server side rendering), which is then rendered onto browser.
 And the keyword window is object of the DOM(browser), which doesn't exist on 'Next' server, therefore we cannot use window keyword 
 directly here.

 And in lottery project we assumed that the person using the app(on browser), has a metamask account, which cannot be the case always.
 This is where Next.js comes into the picture. We will connect to the Ethereum Network from the Next server, and then render onto the 
 browser, so person using any account(other than metamask) would be able to use the app.
*/

// THEREFORE: THIS FILE GET EXECUTED TWO TIMES FIRST ONTO THE "NEXT" SERVER(This is node.js) THEN ON THE BROWSER

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://goerli.infura.io/v3/6b127933f36f47f6a6820ed784f2d0a1'
  );
  web3 = new Web3(provider);
}

export default web3;
