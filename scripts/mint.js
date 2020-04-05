const { setupLoader } = require('@openzeppelin/contract-loader');
const proofs = require('./proofs.json');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const secrets = require('../secrets.json');
const { mnemonic, provider, solnSquareVerifierAddress } = secrets.development;

const hdWalletProvider = new HDWalletProvider(mnemonic, provider);
const web3 = new Web3(hdWalletProvider);
const loader = setupLoader({ provider: web3 });

const contract = loader.web3.fromArtifact('SolnSquareVerifier', solnSquareVerifierAddress);

const mint = async () => {
    console.log('Minting started...');

    const owner = await contract.methods.owner().call();
    const accounts = await web3.eth.getAccounts();
    const { gasLimit } = await web3.eth.getBlock("latest");

    for (let i = 0; i < proofs.length; i++) {
        const proof = proofs[i].proof;
        const inputs = proofs[i].inputs;
        const tokenId = i + 1;
        const account = accounts[i + 1];

        try {
            console.log(`Trying to mint token ${tokenId} for account ${account}`);
            await contract.methods.mintNewToken(account, tokenId, proof.a, proof.b, proof.c, inputs)
                          .send({ from: owner, gas: gasLimit });
        } catch (e) {
            console.error(e.message);
        }
    }
};

mint().then(() => {
                console.log('Minting completed successfully!');
                hdWalletProvider.engine.stop();
            },
            error => console.log(error));
