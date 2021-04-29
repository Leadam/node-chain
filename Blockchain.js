const crypto = require('crypto');
const BSON = require('bson');
const fs = require('fs');

class Block{
    constructor(timestamp, data, prevHash = "") {
        this.timestamp = timestamp
        this.data = data
        this.prevHash = prevHash
        this.hash = this.computeHash()
        this.nonce = 0
    }

    computeHash(){
        const hash = crypto.createHash('sha256');
        return hash.update(this.timestamp + JSON.stringify(this.data) + this.prevHash + this.nonce).digest('hex').toString()
    }

    mineBlock(fn = undefined){
        this.hash = this.computeHash()
        if(typeof fn !== "undefined") {
            while (!fn(this.hash)) {
                this.nonce++
                this.hash = this.computeHash()
            }
        }
    }

    isValid(fn = undefined){
        if(this.computeHash() !== this.hash){
            return false
        }
        if(typeof fn !== "undefined" ){
            return fn(this.hash)
        }
        return true
    }
}

class Chain{
    constructor(name,  miningFunction= undefined) {
        this.name = name
        this.chain = [new Block(Date.now(), ["#"], null)]
        this.mineingFunction = miningFunction;
    }

    getLastBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(block){
        block.prevHash = this.getLastBlock().hash
        block.mineBlock(this.mineingFunction)
        this.chain.push(block)
    }

    isValid(){
        for(let i=1; i < this.chain.length; ++i){
            const prevBlock = this.chain[i-1]
            const currentBlock = this.chain[i]

            if(currentBlock.prevHash !== prevBlock.hash){
                return false
            }

            if(!currentBlock.isValid(this.mineingFunction)){
                return false
            }
        }
        return true
    }

    writeToFile(filename, callback = () => {}){
        fs.writeFileSync(filename, BSON.serialize(this.chain))
    }

    readFromFile(filename){
        this.chain = BSON.deserialize(fs.readFileSync(filename))
    }
}

module.exports.Block = Block
module.exports.Chain = Chain
