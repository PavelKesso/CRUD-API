import { User } from "./user";
import { isUid } from "./uid/uid";
import { UserNotExist } from "./error/UserNotExist";
import { InvalidUUID } from "./error/InvalidUUID";

export class Storage {
    data: Map<String, User>

    constructor() {
        this.data = new Map()
    }

    newConnection(): Connection {
        return new Connection(this)
    }
}

export class Connection {
    storage: Storage

    constructor(storage: Storage) {
        this.storage = storage
    }

    getAll(): Array<User> {
        return Array.from(this.storage.data.values())
    }

    getByUid(uid: string): User {
        if (isUid(uid)) {
            const user = this.storage.data.get(uid)
            if (user == undefined) {
                throw new UserNotExist(uid)
            } else {
                return user
            }
        } else {
            throw new InvalidUUID(uid)
        }
    }

    add(name: string, age: number, hobbies: string[]): User {
        const user = new User(name, age, hobbies)
        this.storage.data.set(user.id, user)

        return user
    }

    update(uid: string, name?: string, age?: number, hobbies?: string[]) {
        const user = this.getByUid(uid)

        if (name != undefined) {
            user.name = name
        }
        if (age != undefined) {
            user.age = age
        }
        if (hobbies != undefined) {
            user.hobbies = hobbies
        }

        this.storage.data.set(uid, user)
    }

    delete(uid: string) {
        if (isUid(uid)) {
            if (!this.storage.data.delete(uid)) {
                throw new UserNotExist(uid)
            }
        } else {
            throw new InvalidUUID(uid)
        }
    }
}