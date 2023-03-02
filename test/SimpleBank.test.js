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

      it("should reject start from everyone except owner", async () => {
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

    it("should reject addMember from everyone except owner", async () => {
        await expect(simpleBank.connect(acc1).addMember(acc2.address)).to.be.rejected
    })

    it("should get money only from owner and members", async () => {
        await simpleBank.start(200)
        
        let tx = await simpleBank.addToBalance( {value:100} )
        let balance = await simpleBank.balance()
        expect(balance).to.eq(100)

        await simpleBank.addMember(acc1.address)
        tx = await simpleBank.connect(acc1).addToBalance( {value:50} )
        balance = await simpleBank.balance()
        expect(balance).to.eq(150)

        await expect(simpleBank.connect(acc2).addToBalance( {value:50} )).to.be.reverted

    })

    it ("should revert unnesesary sums", async () => {
        await simpleBank.start(50)
        await expect(simpleBank.addToBalance( {value:51} )).to.be.reverted
    })

    it ("default withdraw func", async () => {
        await simpleBank.start(50)

        await expect(simpleBank.addToBalance({value:50}))

        expect(await simpleBank.rest()).to.eq(0)

        await simpleBank.withdraw()
        
        const balance = await simpleBank.balance()
        expect(balance).to.eq(0)

        expect(await simpleBank.currentBankState()).to.be.false
        
        const sum = await simpleBank.sum()
        expect(sum).to.eq(0)
    })

    it("should revert withdraw with wrong balance and from everyone except owner", async () => {
        await simpleBank.start(50)

        await simpleBank.addToBalance({value:40})

        expect(await simpleBank.rest()).to.eq(10)

        await expect(simpleBank.withdraw()).to.be.rejected

        await expect(simpleBank.connect(acc2).withdraw()).to.be.rejected
    })
})