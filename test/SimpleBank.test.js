const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleBank", () => {
    let owner 
    let acc1 
    let acc2 
    let acc3 
    let simpleBank


    beforeEach(async () => {
        [owner, acc1, acc2, acc3] = await ethers.getSigners()
        const SimpleBank = await ethers.getContractFactory("SimpleBank", owner)
        simpleBank = await SimpleBank.deploy()
        await simpleBank.deployed()
        expect(simpleBank.address).to.be.properAddress
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
        const sum = 100
        await simpleBank.start(sum)
        
        const isOwnerMember = await simpleBank.isAccMember(owner.address)
        expect(isOwnerMember).to.be.true
      
        const bankState = await simpleBank.currentBankState()
        expect(bankState).to.be.true
      
        const contractSum = await simpleBank.sum()
        expect(contractSum).to.eq(sum)
      });

      it("should reject start from everyone exept owner", async () => {
        await expect(simpleBank.connect(acc1).start(100)).to.be.rejected
      })


    it("should add new member to mapping and array with function addMember", async () => {
        const sum = 100
        await simpleBank.start(sum)

        await simpleBank.addMember(acc1.address)

        const isUserMember = await simpleBank.isAccMember(acc1.address)
        expect(isUserMember).to.be.true

        const member = await simpleBank.members(1)
        expect(member).to.eq(acc1.address)
    })

    // add a test to test array support in `addMember()` function

    it("should reject addMember from everyone exept owner", async () => {
        await expect(simpleBank.connect(acc1).addMember(acc2.address)).to.be.rejected
    })
})