export class InvalidUUID extends Error {
    code = 400

    constructor(id: string) {
        super('Invalid uuid: ' + id)
    }
}