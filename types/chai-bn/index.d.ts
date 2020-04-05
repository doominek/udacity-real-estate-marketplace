/// <reference types="node" />
/// <reference types="chai" />

declare global {
    namespace Chai {
        interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
            bignumber: Assertion;
            zero: Assertion;
        }
    }
}

declare const chaiBN: Chai.ChaiPlugin;
export = chaiBN;
