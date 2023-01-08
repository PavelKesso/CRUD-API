import { v4 as uid } from 'uuid'

export class User {
    id: string
    name: string
    age: number
    hobbies: string[]

    constructor(
        name: string,
        age: number,
        hobbies: string[]
    ) {
        this.id = uid()
        this.name = name
        this.age = age
        this.hobbies = hobbies
    }
}