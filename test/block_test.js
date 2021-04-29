const {assert, expect} = require('chai')
const Block = require("../Blockchain").Block

describe('Block', () => {
    it('Create block', () => {
        const now = new Date()
        const block = new Block(now, "Hello");
        expect(block.data, "Hello")
        expect(block.timestamp, now)
    })

    it('Simple mining block', () => {
        const now = new Date()
        const block = new Block(now, "Hello");

        block.mineBlock()

        expect(block.hash, block.computeHash())
    })

    it('Simple "hard" block', () => {
        const now = new Date()
        const block = new Block(now, "Hello");

        block.mineBlock(item => item[0] === "0")

        expect(block.hash, block.computeHash())
        expect(block.hash[0], "0")
    })

    it('Valid block', () => {
        const now = new Date()
        const block = new Block(now, "Hello");

        const fn = item => item[0] === "0"
        block.mineBlock(fn)

        assert(block.isValid(fn))
    })

    it('Invalid block #1', () => {
        const now = new Date()
        const block = new Block(now, "Hello");

        const fn = item => item[0] === "0"
        block.mineBlock(fn)

        block.data = "Hello world"

        assert(!block.isValid(fn))
    })

    it('Invalid block #2', () => {
        const now = new Date()
        const block = new Block(now, "Hello");

        const fn = item => item[0] === "0"
        block.mineBlock(fn)

        block.timestamp = new Date(0)

        assert(!block.isValid(fn))
    })

    it('Invalid block #3', () => {
        const now = new Date()
        const block = new Block(now, "Hello");

        const fn = item => item[0] === "0"
        block.mineBlock(fn)

        block.nonce = 0
        block.hash = block.computeHash()

        assert(!block.isValid(fn))
    })
})