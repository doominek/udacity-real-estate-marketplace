# Udacity Blockchain Capstone - Real Estate Marketplace @ OpenSea with zkSNARKs

This project demonstrates Solidity contract implementing ERC721 NFT standard with zkSNARKs used
for validation when minting new tokens. Contract creates dREM (Dom's Real Estate Marketplace) tokens 
that allows trading real estates.

## Running project

To run the project please use the following script:
```shell script
npm install
npm run compile
``` 

To run tests please execute the following:
```shell script
npm run test
```


## Deployment details

* token name: *Dom's Real Estate Marektplace*
* token symbol: *dREM*
* token tracker: https://rinkeby.etherscan.io/token/0x945Fb77A041E1769053EcF60C9F73E97Fd765DA7
* contract address: https://rinkeby.etherscan.io/address/0x945Fb77A041E1769053EcF60C9F73E97Fd765DA7
* OpenSea storefront: https://rinkeby.opensea.io/assets/doms-real-estate-marketplace 


## Tools/Libraries used

In the project the following libraries were used:
* `node` - version: 10.18.1
* `npm` - version: 6.14.2
* `typescript` - version: 3.8.3 - tests were written using typescript for 
compile-time safety and better development experience
* `oz` - version: 2.8.0, instead of using truffle, Open Zeppelin's CLI and its helper tools were used
* `zokrates` - for generating proofs and Verifier contract
