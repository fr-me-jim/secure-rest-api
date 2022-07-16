export default class TypeGuardError extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, TypeGuardError.prototype);
    }
};