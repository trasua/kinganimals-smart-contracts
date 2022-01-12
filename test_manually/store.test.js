const {expect} = require('chai')
const {formatTrx, shasta, Sale, tokenApprove, nftApprove, UserInfo} = require('../utils')
const tronWeb = require('tronweb')
const {storeAddress, nftAddress, tokenAddress, userInfoAddress} = require('../shasta_address.json')

describe('Store', () => {
    before('init', async () => {
        this.Store = await shasta(process.env.PRIVATE_KEY_SHASTA_2).contract().at(storeAddress)
        this.UserInfo = await shasta(process.env.PRIVATE_KEY_SHASTA_2).contract().at(userInfoAddress)
        this.Token = await shasta(process.env.PRIVATE_KEY_SHASTA_2).contract().at(tokenAddress)
    })

    it('check price', async () => {
        const price = await this.Store.price().call()
        console.log('price', formatTrx(price))
    })

    it('check available quantity', async () => {
        const quant1 = await this.Store.quantity(/*itemId=*/10).call() // quantity of item id 10
        const quant2 = await this.Store.quantity(/*itemId=*/11).call() // quantity of item id 11
        console.log('quant1', quant1.toNumber())
        console.log('quant2', quant2.toNumber())
    }).timeout(20000)

    it('buy', async () => {
        await tokenApprove({
            contract: this.Token,
            targetAddress: storeAddress,
            amount: tronWeb.toSun(20000)
        })

        const tx = await this.Store.buy(
            /*number to buy=*/1,
            /*uri=*/'https://static.howlcity.io/bike/11.json',
            /*itemId=*/11
        ).send({
            feeLimit: tronWeb.toSun('200'),
            shouldPollResponse: false
        })

        await new Promise(r => setTimeout(r, 7000))

        const transactionInfo = await this.Store.tronWeb.trx.getTransaction(tx)
        // console.log(transactionInfo)
        if (transactionInfo.ret[0].contractRet !== 'SUCCESS') {
            console.log('transaction error')
        } else {
            console.log('transaction success')
        }
    }).timeout(20000)

    it('check nft', async () => {
        const res = await this.UserInfo.getUserNft(this.UserInfo.tronWeb.defaultAddress.base58).call()
        console.log(UserInfo(res))
    }).timeout(20000)
})
