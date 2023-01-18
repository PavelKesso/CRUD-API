import { User } from "./user"
import { UserNotExist } from "./error/UserNotExist"
import { InvalidUUID } from "./error/InvalidUUID"
import { validate } from 'uuid'
import cluster from "cluster"

export class Storage {
    data: Map<String, User>

    constructor() {
        this.data = new Map()
    }

    newConnection(): Connection {
        return new Connection(this)
    }

    nitifyDataChanges() {
        cluster.worker?.send({ users: Object.fromEntries(this.data) } )
    }

    updateUsers(users: any) { 
        this.data.clear()

        Object.keys(users).forEach((key: any) => {
            this.data.set(key, users[key]) 
        })       
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
        if (validate(uid)) {
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
        this.storage.nitifyDataChanges()

        return user
    }

    update(uid: string, name?: string, age?: number, hobbies?: string[]): User {
        const user = this.getByUid(uid)

        if (name != undefined) {
            user.username = name
        }
        if (age != undefined) {
            user.age = age
        }
        if (hobbies != undefined) {
            user.hobbies = hobbies
        }

        this.storage.data.set(uid, user)
        this.storage.nitifyDataChanges()
        return user
    }

    delete(uid: string) {
        if (validate(uid)) {
            if (!this.storage.data.delete(uid)) {
                throw new UserNotExist(uid)
            } else {
                this.storage.nitifyDataChanges()
            }
        } else {
            throw new InvalidUUID(uid)
        }
    }
}