export default class TypeGuardError extends Error {
    constructor() {
        super();

        Object.setPrototypeOf(this, TypeGuardError.prototype);
    }
};