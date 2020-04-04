import { accounts, contract } from '@openzeppelin/test-environment';
import { VerifierContract, VerifierInstance } from '../types/contracts';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { proof, inputs } from './example-proof.json';

const { expectEvent } = require('@openzeppelin/test-helpers');
const Verifier: VerifierContract = contract.fromArtifact('Verifier');

use(chaiAsPromised);

describe('Verifier', function () {
    this.timeout(5000);

    const [ owner ] = accounts;
    let instance: VerifierInstance;

    beforeEach(async () => {
        instance = await Verifier.new({ from: owner });
    });

    it('should verify correct proof', async () => {
        const tx = await instance.verifyTx(proof.a, proof.b, proof.c, inputs);

        expectEvent(tx, 'Verified', { s: 'Transaction successfully verified.'});
    });

    it('should not verify incorrect proof', async () => {
        const tx = await instance.verifyTx(proof.a, proof.b, proof.c, [ 16, 1 ]);

        expect(tx.logs).to.be.empty;
    });
});
