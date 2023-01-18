import { v4 as uid } from 'uuid'

export class User {
    id: string
    username: string
    age: number
    hobbies: string[]

    constructor(
        name: string,
        age: number,
        hobbies: string[]
    ) {
        this.id = uid()
        this.username = name
        this.age = age
        this.hobbies = hobbies
    }
}