export function validateUser(userJson: any): Boolean {
    return notUndefined(userJson.name) && isString(userJson.name) &&
        notUndefined(userJson.age) && isNumber(userJson.age) &&
        notUndefined(userJson.hobbies) && Array.isArray(userJson.hobbies) &&
        Array.from(userJson.hobbies).every(isString)
}

const notUndefined = (value: any) => value != undefined
const isString = (value: any) => (typeof value) === 'string'
const isNumber = (value: any) => (typeof value) === 'number'