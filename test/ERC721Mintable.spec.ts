import { accounts, contract } from '@openzeppelin/test-environment';
import { DREMTokenContract, DREMTokenInstance } from '../types/contracts';
import { expect } from 'chai';
import 'mocha';

const { BN } = require('@openzeppelin/test-helpers');

const DREMToken: DREMTokenContract = contract.fromArtifact('DREMToken');

const token = {
    name: 'Dom\'s Real Estate Marketplace',
    symbol: 'dREM',
    baseUri: 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/'
};

describe('DREMToken', function () {
    const [ owner ] = accounts;
    let instance: DREMTokenInstance;

    beforeEach(async () => {
        instance = await DREMToken.new({ from: owner });
    });

    it('should have proper name, symbol and baseUri', async () => {
        const name = await instance.name();
        const symbol = await instance.symbol();
        const baseTokenUri = await instance.baseTokenURI();

        expect(name).to.be.equal(token.name);
        expect(symbol).to.be.equal(token.symbol);
        expect(baseTokenUri).to.be.equal(token.baseUri);
    });

    describe('match erc721 spec', function () {
        it('should return total supply', async () => {
            throw new Error('Not implemented yet');
        });

        it('should get token balance', async () => {
            throw new Error('Not implemented yet');
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async () => {
            throw new Error('Not implemented yet');
        });

        it('should transfer token from one owner to another', async () => {
            throw new Error('Not implemented yet');
        });
    });


    describe('have ownership properties', function () {
        it('should fail when minting when address is not contract owner', async () => {
            throw new Error('Not implemented yet');
        });

        it('should return contract owner', async () => {
            throw new Error('Not implemented yet');
        });
    });
});
