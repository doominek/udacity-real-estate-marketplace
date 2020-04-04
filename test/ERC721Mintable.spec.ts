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

    describe('pausable properties', () => {
        it('should be initially unpaused', async () => {
            const paused = await instance.isPaused();

            expect(paused).to.be.false;
        });

        it('should not allow unpausing when unpaused', async () => {
            try {
                await instance.unpause({ from: owner });
                expect.fail('Should fail');
            } catch (e) {
                expect(e).to.have.property('reason', 'Only allowed when paused');
            }
        });

        describe('when pausing', async () => {
            it('should not be allowed for non owner', async () => {
                try {
                    await instance.pause({ from: accounts[1] });
                    expect.fail('Should fail');
                } catch (e) {
                    expect(e).to.have.property('reason', 'Only owner allowed');
                }
            });

            it('should update paused state', async () => {
                const tx = await instance.pause({ from: owner });
                const paused = await instance.isPaused();

                expect(paused).to.be.true;

                const log = tx.logs[0];
                expect(log.event).to.be.equal('Paused');
                expect(log.args).to.have.property('account', owner);
            });


        });

        describe('when unpausing', async () => {
            beforeEach(async () => {
                await instance.pause({ from: owner });
            });

            it('should not be allowed for non owner', async () => {
                try {
                    await instance.unpause({ from: accounts[1] });
                    expect.fail('Should fail');
                } catch (e) {
                    expect(e).to.have.property('reason', 'Only owner allowed');
                }
            });

            it('should update paused state', async () => {
                const tx = await instance.unpause({ from: owner });
                const paused = await instance.isPaused();

                expect(paused).to.be.false;

                const log = tx.logs[0];
                expect(log.event).to.be.equal('Unpaused');
                expect(log.args).to.have.property('account', owner);
            });
        });
    });

    describe('ownership properties', () => {
        it('should fail when minting when address is not contract owner', async () => {
            throw new Error('Not implemented yet');
        });

        it('should return contract owner', async () => {
            const account = await instance.owner();

            expect(account).to.be.equal(account);
        });

        it('can transfer ownership to new account', async () => {
            const newOwner = accounts[1];

            const tx = await instance.transferOwnership(newOwner, { from: owner });
            const currentOwner = await instance.owner();

            expect(currentOwner).to.be.equal(newOwner);

            const log = tx.logs[0];
            expect(log.event).to.be.equal('OwnershipTransferred');
            expect(log.args).to.have.property('previousOwner', owner);
            expect(log.args).to.have.property('newOwner', newOwner);
        });

        it('should not allow ownership transfer when caller is not current owner', async () => {
            try {
                const newOwner = accounts[1];
                await instance.transferOwnership(newOwner, { from: newOwner });
                expect.fail('Should fail');
            } catch (e) {
                expect(e).to.have.property('reason', 'Only owner allowed');
            }
        });
    });
});
