export class UserNotExist extends Error {
    code = 404
    
    constructor(id: string) {
        super('User with id: ' + id + 'is not exist')
    }
}