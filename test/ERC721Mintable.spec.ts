import { accounts, contract } from '@openzeppelin/test-environment';
import { DREMTokenContract, DREMTokenInstance } from '../types/contracts';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import TransactionResponse = Truffle.TransactionResponse;

const { BN } = require('@openzeppelin/test-helpers');

const DREMToken: DREMTokenContract = contract.fromArtifact('DREMToken');

const token = {
    name: 'Dom\'s Real Estate Marketplace',
    symbol: 'dREM',
    baseUri: 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/'
};

use(chaiAsPromised);

describe('DREMToken', function () {
    const [ owner, user1 ] = accounts;
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

    describe('match erc721 spec', () => {
        it('should return total supply', async () => {
            throw new Error('Not implemented yet');
        });

        it('should get token balance', async () => {
            throw new Error('Not implemented yet');
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async () => {
        });

        it('should transfer token from one owner to another', async () => {
            throw new Error('Not implemented yet');
        });
    });

    describe('after minting first token', () => {
        let tx: TransactionResponse;
        const tokenId = 13;

        beforeEach(async () => {
            tx = await instance.mint(user1, tokenId, { from: owner });
        });

        it('should generate transfer event', async () => {
            const log = tx.logs[0];
            expect(log.event).to.be.equal('Transfer');
            expect(log.args).to.have.property('from', owner);
            expect(log.args).to.have.property('to', user1);
            expect(log.args.tokenId).to.be.bignumber.equal(new BN(tokenId));
        });

        it('should have owner set to the recipient', async () => {
            const tokenOwner = await instance.ownerOf(tokenId);

            expect(tokenOwner).to.be.equal(user1);
        });

        it('should have balance of 1', async () => {
            const balance = await instance.balanceOf(user1);

            expect(balance).to.be.bignumber.equal('1');
        });

        it('should have uri generated', async () => {
            const uri = await instance.tokenURI(tokenId);
            expect(uri).to.be.equal(token.baseUri + tokenId);
        });

        it('should have total supply equal 1', async () => {
            const totalSupply = await instance.totalSupply();
            expect(totalSupply).to.be.bignumber.equal('1');
        });

        it('should have stored token by index', async () => {
            const firstToken = await instance.tokenByIndex(0);

            expect(firstToken).to.be.bignumber.equal(new BN(tokenId));
        });

        it('should have stored token by owner index', async () => {
            const firstUer1Token = await instance.tokenOfOwnerByIndex(user1, 0);

            expect(firstUer1Token).to.be.bignumber.equal(new BN(tokenId));
        });
    });

    describe('pausable properties', () => {
        it('should be initially unpaused', async () => {
            const paused = await instance.isPaused();

            expect(paused).to.be.false;
        });

        it('should not allow unpausing when unpaused', async () => {
            await expect(instance.unpause({ from: owner }))
                .to.eventually.be.rejectedWith(Error)
                .with.property('reason', 'Only allowed when paused');

        });

        describe('when pausing', async () => {
            it('should not be allowed for non owner', async () => {
                await expect(instance.pause({ from: accounts[1] }))
                    .to.eventually.be.rejectedWith(Error)
                    .with.property('reason', 'Only owner allowed');
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
                await expect(instance.unpause({ from: accounts[1] }))
                    .to.eventually.be.rejectedWith(Error)
                    .with.property('reason', 'Only owner allowed');
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
        it('should fail when minting by non contract owner', async () => {
            await expect(instance.mint(user1, 1, { from: user1 }))
                .to.eventually.be.rejectedWith(Error)
                .with.property('reason', 'Only owner allowed');
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
            await expect(instance.transferOwnership(user1, { from: user1 }))
                .to.eventually.be.rejectedWith(Error)
                .with.property('reason', 'Only owner allowed');
        });
    });
});
