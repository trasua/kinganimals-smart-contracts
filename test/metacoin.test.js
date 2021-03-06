const MetaCoin = artifacts.require('./MetaCoin.sol')

contract.skip('MetaCoin', (accounts) => {
    it.skip('should put 10000 MetaCoin in the first account', () => {
        return MetaCoin.deployed()
            .then(function (instance) {
                return instance.call('getBalance', [accounts[0]])
            })
            .then(function (balance) {
                assert.equal(
                    balance.toNumber(),
                    10000,
                    "10000 wasn't in the first account"
                )
            })
    })

    it.skip('should call a function that depends on a linked library', () => {
        var meta
        var metaCoinBalance
        var metaCoinEthBalance
        return MetaCoin.deployed()
            .then(function (instance) {
                meta = instance
                return meta.call('getBalance', [accounts[0]])
            })
            .then(function (outCoinBalance) {
                metaCoinBalance = outCoinBalance.toNumber()
                return meta.call('getBalanceInEth', [accounts[0]])
            })
            .then(function (outCoinBalanceEth) {
                metaCoinEthBalance = outCoinBalanceEth.toNumber()
            })
            .then(function () {
                assert.equal(
                    metaCoinEthBalance,
                    2 * metaCoinBalance,
                    'Library function returned unexpected function, linkage may be broken'
                )
            })
    })

    it.skip('should send coin correctly', () => {
        var meta

        // Get initial balances of first and second account.
        var account_one = 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY' //accounts[0];
        var account_two = 'TBp39yWZhFEG5NdAoFFxepaj2dxCQjNmB9' //accounts[1];

        var account_one_starting_balance
        var account_two_starting_balance
        var account_one_ending_balance
        var account_two_ending_balance

        var amount = 10

        return MetaCoin.deployed()
            .then(function (instance) {
                meta = instance
                return meta.call('getBalance', [account_one])
            })
            .then(function (balance) {
                account_one_starting_balance = balance.toNumber()
                return meta.call('getBalance', [account_two])
            })
            .then(function (balance) {
                account_two_starting_balance = balance.toNumber()
                return meta.call('sendCoin', [account_two, amount])
            })
            .then(function () {
                return meta.call('getBalance', [account_one])
            })
            .then(function (balance) {
                account_one_ending_balance = balance.toNumber()
                return meta.call('getBalance', [account_two])
            })
            .then(function (balance) {
                account_two_ending_balance = balance.toNumber()

                assert.equal(
                    account_one_ending_balance,
                    account_one_starting_balance - amount,
                    "Amount wasn't correctly taken from the sender"
                )
                assert.equal(
                    account_two_ending_balance,
                    account_two_starting_balance + amount,
                    "Amount wasn't correctly sent to the receiver"
                )
            })
    })
})
