import bcrypt from "bcrypt";
import {
    v4 as uuidv4
} from 'uuid';
import md5 from "md5";

let genUuid = function (password) {
    return uuidv4();
}
let comparePassword = function (password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash)
}
let generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
}
let generateID = function (firstname, lastname) {
    const firstTwoCharsFirstName = firstname.replace(/\s/g, '').slice(0, 2).toUpperCase();
    const firstTwoCharsLastName = lastname.replace(/\s/g, '').slice(0, 2).toUpperCase();

    const timestamp = Date.now();
    const shortenedTimestamp = timestamp.toString().slice(-4);

    const id = `${firstTwoCharsFirstName}${firstTwoCharsLastName}${shortenedTimestamp}`;

    return id;
}
let toMd5 = function (str) {
    return md5(str)
}
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let randomString = function (length) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


export default {
    generateHash: generateHash,
    generateID: generateID,
    comparePassword: comparePassword,
    genUuid: genUuid,
    toMd5: toMd5,
    randomString: randomString
}