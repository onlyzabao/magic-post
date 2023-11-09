import bcrypt from "bcrypt";
import {
    v4 as uuidv4
} from 'uuid';
import md5 from "md5";
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let genUuid = function (password) {
    return uuidv4();
}
let comparePassword = function (password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash)
}
let generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
}
let toMd5 = function (str) {
    return md5(str)
}
let randomString = function (length) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


export default {
    generateHash: generateHash,
    comparePassword: comparePassword,
    genUuid: genUuid,
    toMd5: toMd5,
    randomString: randomString
}