namespace BioDeep.Models.Precursors {

    export const PosAdducts = {
        "[M+H]+": 1.007276,
        "[M+NH4]+": 18.033823,
        "[M+Na]+": 22.989218,
        "[M+CH3OH+H]+": 33.033489,
        "[M+K]+": 38.963158,
        "[M]+": 0.0
    };

    export const NegAdducts = {
        "[M-H2O-H]-": -19.01839,
        "[M-H]-": - 1.007276,
        "[M+Na-2H]-": 20.974666,
        "[M+Cl]-": 34.969402,
        "[M+K-2H]-": 36.948606,
        "[M]-": 0.0
    };

    export function evalMz(mass: number, type: string = "[M+H]+") {
        return mass + getAdductMass(type);
    }

    export function getAdductMass(type: string) {
        if (type.endsWith("+")) {
            if (type in PosAdducts) {
                return PosAdducts[type];
            } else {
                throw `unknown precursor type '${type}'...`;
            }
        } else {
            if (type in NegAdducts) {
                return NegAdducts[type];
            } else {
                throw `unknown precursor type '${type}'...`;
            }
        }
    }

    export function evalMass(mz: number, type: string = "[M+H]+") {
        return mz - getAdductMass(type);
    }
}