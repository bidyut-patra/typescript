import crypto = require('crypto');

export function getSessionId(): string {
    return crypto.randomBytes(16).toString('base64');
}

export function encryptUser(user: string): string {
    const cipher = crypto.createCipher('aes-128-cbc', 'd#ffd@gh!');
    let encryptedUserToken = cipher.update(user, 'utf8', 'hex')
    encryptedUserToken += cipher.final('hex');
    return encryptedUserToken;
}

export function decryptUser(userToken: string) {
    const cipher = crypto.createDecipher('aes-128-cbc', 'd#ffd@gh!');
    let decryptedUserToken = cipher.update(userToken, 'hex', 'utf8')
    decryptedUserToken += cipher.final('utf8');
    return decryptedUserToken;    
}