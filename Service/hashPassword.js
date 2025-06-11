const dataSource = require('../Datasource/MySQLMngr');
const crypto = require('crypto');
require('dotenv').config();
/** 
 * @param {*} pass
 * @returns
 */

const SALT_SIZE = parseInt(process.env.SALT_SIZE || '12');

function getSalt() {
    return crypto.randomBytes(SALT_SIZE).toString('base64url').substring(0, SALT_SIZE);
}

function encryptPassword(password, salt) {
    const iterations = 100000;
    const keylen = 64; // bytes
    const digest = 'sha512';

    const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('base64url');
    return hash;
}

/**
 * @param {*} username
 * @param {*} password
 * @returns
 */
async function isValidUser(username, password){
    let query = 'SELECT idUsuario as id, email, nombre, password FROM usuario WHERE email = ?';
    let params = [username];
    let qResult = await dataSource.getDataWithParams(query, params);
    let user = qResult.rows[0];
    if(user){
        const salt = user.password.substring(0 , SALT_SIZE);
        const hash = encryptPassword(password, salt);
        const expectedpassword = salt + hash;

        if(user.password === expectedpassword){
            return user;
        }
    }
    return null;
}

function comparePassword(plainPassword, hashedPassword) {
    try {
        const salt = hashedPassword.substring(0, SALT_SIZE);
        const hash = encryptPassword(plainPassword, salt);
        const expectedPassword = salt + hash;
        return hashedPassword === expectedPassword;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}

module.exports = {encryptPassword, isValidUser, getSalt, comparePassword};