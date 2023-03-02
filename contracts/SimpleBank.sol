//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleBank is Ownable {
    
    uint256 public sum;

    uint256 public balance;

    bool public currentBankState;

    ///@dev do mapping
    mapping (address => bool) public isMember;
    address [] public members;
    
    function addToBalance() external payable {
        require(currentBankState && rest() != 0 && isMember[msg.sender] && msg.value <= rest());
        balance += msg.value; 
    }

    function start(uint _sum) external onlyOwner {
        sum = _sum;
        isMember[owner()] = true;
        members.push(owner());
        currentBankState = true;
    }


    ///@dev do array support
    function addMember(address _user) external onlyOwner {
        isMember[_user] = true;
        members.push(_user);
    }


    function withdraw() external onlyOwner {
        require(rest() == 0);
        currentBankState = false;
        membersReset();
        sum = 0;
        balance = 0;
        (bool success,) = owner().call{ value:sum }( "" );
        require(success);
    }

    function membersReset() private {
        for (uint8 i=0; i < members.length; i++) {
            isMember[members[i]] = false;
        }
    }

    function rest () public view returns(uint) {
        return sum - balance;
    }

    function viewCurrentBankState() public view returns (bool) {
        return currentBankState;
    }

    function isAccMember(address _user) public view returns (bool) {
        return isMember[_user];
    } 


}