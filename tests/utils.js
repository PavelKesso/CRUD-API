const { User } = require('../build/user.js');

const parseUserJSON = (text) => {
    const json = JSON.parse(text)
    const createdUser = new User(
        json.username,
        json.age,
        json.hobbies
    )
    createdUser.id = json.id
    return createdUser
}

const parseUser = (user) => {
    const createdUser = new User(
        user.username,
        user.age,
        user.hobbies
    )
    createdUser.id = user.id
    return createdUser
}

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

exports.parseUserJSON = parseUserJSON
exports.parseUser = parseUser
exports.arraysEqual = arraysEqual