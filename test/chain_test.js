const {assert, expect} = require('chai')
const {Chain, Block} = require("../Blockchain")

describe('Blockchain', () => {
    it('Create chain', () => {
        const chain = new Chain("Test")
        expect(chain.name, "Test")
    })

    it('Vaild chain', () => {
        const chain = new Chain("Test")
        assert(chain.isValid())
    })

    it('Vaild chain #1', () => {
        const chain = new Chain("Test")
        const now = new Date()
        const block = new Block(now, "Hello");

        chain.addBlock(block)
        chain.miningPendingBlock()

        assert(chain.isValid())
    })

    it('Invalid chain', () => {
        const chain = new Chain("Test")
        const now = new Date()
        const block = new Block(now, "Hello");

        chain.addBlock(block)
        chain.miningPendingBlock()

        chain.getLastBlock().data = "Hello world"

        assert(!chain.isValid())
    })

})