export class UserNotExist extends Error {
    constructor(id: string) {
        super("User with id: $id is not exist")
    }
}