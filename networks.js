const { rinkeby } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
    networks: {
        development: {
            protocol: 'http',
            host: 'localhost',
            port: 8545,
            gas: 5000000,
            gasPrice: 5e9,
            networkId: '*',
        },
        rinkeby: {
            provider: () => new HDWalletProvider(rinkeby.mnemonic, rinkeby.provider),
            networkId: 4,
            gasPrice: 10e9
        }
    },
};
