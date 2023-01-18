export function validateUser(userJson: any): Boolean {
    return notUndefined(userJson.username) && isString(userJson.username) &&
        notUndefined(userJson.age) && isNumber(userJson.age) &&
        notUndefined(userJson.hobbies) && Array.isArray(userJson.hobbies) &&
        Array.from(userJson.hobbies).every(isString)
}

export function validateUserPut(userJson: any): Boolean {
    const hasName = notUndefined(userJson.username)
    const hasAge = notUndefined(userJson.age)
    const hasHobbies = notUndefined(userJson.hobbies)

    if (!hasName && !hasAge && !hasHobbies)
        return false

    return (hasName ? isString(userJson.username) : true) &&
        (hasAge ? isNumber(userJson.age) : true) &&
        (hasHobbies
            ? Array.isArray(userJson.hobbies)
            && Array.from(userJson.hobbies).every(isString)
            : true)
}

const notUndefined = (value: any) => value != undefined
const isString = (value: any) => (typeof value) === 'string'
const isNumber = (value: any) => (typeof value) === 'number'