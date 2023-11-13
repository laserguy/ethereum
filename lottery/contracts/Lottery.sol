// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;

contract Lottery{
    address public manager;
    /*
        The solidity is full of gotchas at the moment
        Gotcha: It is code that is syntactically valid, that could be semantically wrong or might invite mistakes
        Nested dynamic array is completely okay to create on solidity and even in the Javascript
        1 - The issue is the with the communication(ABI/web3 world), at the moment there is no communication betwwen
             the deployed contract and the called function which can retrieve the nested arrays
        2 - String is a dynamic array, so array of strings cannot be retrieved

        the dynamic array - address[]
        fixed array - address[3]
    */
    address[] public players;
    /*
        The players(addresses) who want to play lottrey, will be added into this array
        Each player has to put some amount of ether into the prize pool and winner takes all 
    */

    constructor() {
        /*
        manager need have the address of the account, who is deploying the contract(and msg object has that info)
        msg object is a global variable which is available whenever any function is called/transacted
        even while creating a contract
        This object contains some infos like sender address etc.
        */
        manager = msg.sender;
    }

    // When someone call this function they might send ether along
    function enter() public payable{
        // Whoever calls this function, 'now available' msg object will have their address and the amount of ether they send along
        // Make sure that function will only procees if caller has sent this much ether
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    /*
        In Solidity there is no random generator, so we will do a pseudo random number generation
    */
    function random() private view returns(uint) {
        // keccak256 is same as sha3
        // not quite so random 'pseudo' random
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }


    // Only manager should be able to call this function
    // Therefore we used the restricted modifer which we created below
    function pickWinner() public restricted{
        
        uint index = random()%players.length;
 
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    /*
        As the name suggests this is a function modifier, we added this construct to the above function.
        The name of the modifier can be anything you want
    */ 
    modifier restricted(){
        require(msg.sender == manager);
        _;
        /*
            The above line _, acts as a placeholder, if added to a function all your code will be inseted here
            For eg.

            the function above pickWinner will become this:-

        function pickWinner() public {
            require(msg.sender == manager);
            uint index = random()%players.length;
    
            payable(players[index]).transfer(address(this).balance);
            players = new address[](0);
        }
        */
    }

    /*
        The view keyword here means that it won't try tp change anything on the blockchain
    */
    function getPlayers() public view returns(address[] memory){
        return players;
    }
}
 