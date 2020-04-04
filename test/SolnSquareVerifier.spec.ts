import { accounts, contract } from '@openzeppelin/test-environment';
import { SolnSquareVerifierContract, SolnSquareVerifierInstance } from '../types/contracts';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { inputs, proof } from './example-proof.json';

const { expectEvent } = require('@openzeppelin/test-helpers');
const SolnSquareVerifier: SolnSquareVerifierContract = contract.fromArtifact('SolnSquareVerifier');

use(chaiAsPromised);

describe.only('Verifier', function () {
    this.timeout(5000);

    const [ owner, user1, user2 ] = accounts;
    let instance: SolnSquareVerifierInstance;

    const tokenId = 13;
    const token2Id = 21;

    beforeEach(async () => {
        instance = await SolnSquareVerifier.new({ from: owner });
    });

    describe('when minting new token', () => {
        it('should mint new token when valid proof submitted', async () => {
            const tx = await instance.mintNewToken(user1, tokenId, proof.a, proof.b, proof.c, inputs,
                                                   { from: owner });

            expectEvent(tx, 'Verified', { s: 'Transaction successfully verified.' });
            expectEvent(tx, 'SolutionAdded', { tokenId: '13', submitter: owner });
            expectEvent(tx, 'Transfer', { from: owner, to: user1, tokenId: '13' });
        });

        it('should fail when invalid proof', async () => {
            await expect(instance.mintNewToken(user1, tokenId, proof.a, proof.b, proof.c, [ 16, 1 ],
                                               { from: owner }))
                .to.eventually.be.rejectedWith(Error)
                .with.property('reason', 'Invalid solution');
        });

        it('should not accept same solution', async () => {
            await instance.mintNewToken(user1, tokenId, proof.a, proof.b, proof.c, inputs,
                                        { from: owner });
            await expect(instance.mintNewToken(user1, token2Id, proof.a, proof.b, proof.c, inputs,
                                               { from: owner }))
                .to.eventually.be.rejectedWith(Error)
                .with.property('reason', 'Solution already submitted');
        });
    });

});
