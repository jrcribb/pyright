/*
 * constraintSolution.ts
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT license.
 * Author: Eric Traut
 *
 * Data structure that holds one or more constraint solutions for a set
 * of type variables.
 */

import { assert } from '../common/debug';
import { FunctionType, ParamSpecType, Type, TypeVarType } from './types';

// Records the types associated with a set of type variables.
export class ConstraintSolutionSet {
    // Indexed by TypeVar ID.
    private _typeVarMap: Map<string, Type>;

    // See the comment in constraintTracker for details about identifying
    // solution sets by scope ID.
    private _scopeIds: Set<string> | undefined;

    constructor(scopeIds?: Set<string>) {
        this._typeVarMap = new Map<string, Type>();

        if (scopeIds) {
            this._scopeIds = new Set<string>(scopeIds);
        }
    }

    isEmpty() {
        return this._typeVarMap.size === 0;
    }

    getType(typeVar: ParamSpecType): FunctionType | undefined;
    getType(typeVar: TypeVarType): Type | undefined;
    getType(typeVar: TypeVarType): Type | undefined {
        const key = TypeVarType.getNameWithScope(typeVar);
        return this._typeVarMap.get(key);
    }

    setType(typeVar: TypeVarType, type: Type) {
        const key = TypeVarType.getNameWithScope(typeVar);
        return this._typeVarMap.set(key, type);
    }

    doForEachTypeVar(callback: (type: Type, typeVarId: string) => void) {
        this._typeVarMap.forEach((type, key) => {
            callback(type, key);
        });
    }
}

export class ConstraintSolution {
    private _solutionSets: ConstraintSolutionSet[];

    constructor(solutionSets?: ConstraintSolutionSet[]) {
        this._solutionSets =
            solutionSets && solutionSets.length > 0 ? [...solutionSets] : [new ConstraintSolutionSet()];
    }

    isEmpty() {
        return this._solutionSets.every((set) => set.isEmpty());
    }

    setType(typeVar: TypeVarType, type: Type) {
        return this._solutionSets.forEach((set) => {
            set.setType(typeVar, type);
        });
    }

    getMainSolutionSet() {
        return this.getSolutionSet(0);
    }

    getSolutionSets() {
        return this._solutionSets;
    }

    doForEachSolutionSet(callback: (solutionSet: ConstraintSolutionSet, index: number) => void) {
        this.getSolutionSets().forEach((set, index) => {
            callback(set, index);
        });
    }

    getSolutionSet(index: number) {
        assert(index >= 0 && index < this._solutionSets.length);
        return this._solutionSets[index];
    }
}
