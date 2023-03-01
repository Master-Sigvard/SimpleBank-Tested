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
        console.log(simpleBank.address)
        expect(simpleBank.address).to.be.properAddress
    })

    it("should be deployed", async () => {
        console.log("success!")
    })
})