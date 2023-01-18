export class UserNotExist extends Error {
    code = 404
    
    constructor(id: string) {
        super('user with id = ' + id + ' does not exist')
    }
}