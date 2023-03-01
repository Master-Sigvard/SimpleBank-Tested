const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleBank", () => {
    let owner 
    let acc1 
    let acc2 
    let acc3 
    let simpleBank

    let isMember

    beforeEach(async () => {
        [owner, acc1, acc2, acc3] = await ethers.getSigners()
        const SimpleBank = await ethers.getContractFactory("SimpleBank", owner)
        simpleBank = await SimpleBank.deploy()
        await simpleBank.deployed()
        expect(simpleBank.address).to.be.properAddress
        isMember = await simpleBank.isMember;
    })

    it("should have 0 values by default", async () => {
        const balance = await simpleBank.balance()
        expect(balance).to.eq(0)
        
        const sum = await simpleBank.sum()
        expect(sum).to.eq(0)

        const bankState = await simpleBank.currentBankState()
        expect(bankState).to.be.false

        const members = await simpleBank.members
        expect(members.length).to.eq(0)
    })

    it("should set sum and add owner as member on start", async () => {
        const sum = 100;
        await simpleBank.start(sum);
        
        const isOwnerMember = await isMember[owner.address]
        expect(isOwnerMember).to.be.true;
      
        const bankState = await simpleBank.currentBankState();
        expect(bankState).to.be.true;
      
        const contractSum = await simpleBank.sum();
        expect(contractSum).to.equal(sum);
      });
})