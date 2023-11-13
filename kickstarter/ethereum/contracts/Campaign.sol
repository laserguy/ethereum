// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;

contract CampaignFactory{
    address[] public deployedCampaigns;

    /*
        This function will be called on the behalf of the person who wants to create the campaign
        We will be using the callers metamask account to deploy the contract, since we should bear the cost
        of deploying the contract
        Therefore we are using `msg.sender`, which will be the caller address to deploy the contract
    */
    function createCampaign(uint minimum) public{
        // Create a contract that is deployed to the blockchain
        address newCampaign = address(new Campaign(minimum,msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    // `view` means no data in the contract is modified
    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address payable recipient;                    // On which account money/crypto needed to release
        bool complete;                       // If the request completed or not
        uint approvalsCount;
        mapping(address=>bool) approvalsY;  // approvers who voted yes for this request
    }

    /*
        Below two lines are added here just to resolve this issue
        "Struct containing a (nested) mapping cannot be constructed"
    */
    uint public numRequests;
    mapping (uint => Request) public requests;

    address public manager;
    uint public minimumContribution;
    //address[] public approvers;
    /*
        We should avoid array or array operations in the contract, as executing anything on EVM costs gas
        And traversing array, doing operations on all the elements can quickly increase the gas, and you
        will have to pay more money.

        mapping data structure is better than array
        But we cannot do any traversing operations in mapping
        Therefore we need another variable to have the total approvers count
    */
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    /*
    storage vs memory
    The difference is explained in two ways
    (most of the documentation talk about this)
    1) Where our contract stores data
        storage: infos are retained across functions, more like a harddrive
            All the member variables are by default storage
        memory: more like a RAM, action by default memory
    2) How our solidity variables store value
        int[] storage newArr = array
        Here newArr will point to the same location as array, any changes made in newArr will be reflected in array
        int[] memory newArr = array
        Copy of array is created and assigned to newArr
    */
    function createRequest(string memory description, uint value, address payable recipient)
     public restricted{

        /*
            onwards 0.7.0 we will recieve below error
            "Struct containing a (nested) mapping cannot be constructed"
            IF WE TRY TO CREATE OBJECT OF STRUCT WHICH HAS A MAPPING INSIDE IT

            Request memory newRequest = Request({
             description:description,
             value:value,
             recipient:recipient,
             complete:false,
             approvalCount:0
         });

         So now it has to be done this way
        */
         Request storage newRequest = requests[numRequests++];
                newRequest.description = description;
                newRequest.value = value;
                newRequest.recipient = recipient;
                newRequest.complete = false;
                newRequest.approvalsCount = 0;
    }

    /*
    Voting system has two important requirements
    1 - Each contibutor can vote exactly once/request
    2 - Voting system should be able to handle large number of contributors(> 1K)
    */
    function approveRequest(uint index) public {
        // index referes to the index of the request for which caller wants to approve.
        Request storage request = requests[index];
        // check if caller is a contributor
        require(approvers[msg.sender]);
        // check if caller already approved
        require(!request.approvalsY[msg.sender]);

        request.approvalsY[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(request.approvalsCount > (approversCount/2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ){
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

}
