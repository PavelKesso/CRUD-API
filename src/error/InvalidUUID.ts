export class InvalidUUID extends Error {
    constructor(id: string) {
        super("Invalid uuid: $id")
    }
}