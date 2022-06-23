export default class TypeError extends Error {
    constructor() {
        super();

        Object.setPrototypeOf(this, TypeError.prototype);
    }
};