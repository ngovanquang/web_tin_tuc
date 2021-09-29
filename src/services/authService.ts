import jwt from 'jsonwebtoken';
import logger from '../middlewares/logger';
import cryptoRandomString from 'crypto-random-string';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import sql from '../common/sqlConnection';
import moment from 'moment';

/**
 * Generate token for user
 * @param userInfo Object contain user information
 */
const signToken = (userInfo: any): string => {
    // userInfo: username, password
    logger.debug(userInfo);
    // Step 1: check database user exited ?
    // Step 2: Password is corected ?
    // Step 3: Sign token
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: userInfo
    }, 'WG8Ct4tvkxZ)<hAG', { algorithm: 'HS256' });
}


/**
 * Validate token
 * @param token 
 */
const validToken = (token: string): boolean => {
    try {
        logger.debug(token);
        jwt.verify(token, 'WG8Ct4tvkxZ)<hAG');
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 * Decode and get the payload data from token
 * @param token 
 */
const getPayload = (token: string): any => {
    return jwt.decode(token);
}

/**
 * Register user with system
 * @param username Tên đăng nhập
 * @param password Mật khẩu
 * @param email Email
 */
const register = async (username: string, password: string, email: string): Promise<boolean> => {
    let passSalt = cryptoRandomString({length: 20, type: 'alphanumeric'});
    let createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let hashedPassword = HmacSHA256(password, passSalt);
    // SQL query
    let query = `INSERT INTO USERS (UserName, Password, PassSalt, Email, CreatedDate)
                VALUES ('${username}', '${hashedPassword}', '${passSalt}', '${email}', '${createdDate}')`;

    let result = await sql.executeQuery(query);
    if (result > 0) {
        return true;
    }

    return false;
}

/**
 * Get user information
 * @param username Tên đăng nhập
 * @param password Mật khẩu
 */
const validUser = async (username: string, password: string): Promise<boolean> => {
    let query = `SELECT Password, PassSalt FROM Users WHERE UserName = '${username}'`;
    let result = await sql.selectQuery(query);

    if (result.length === 1) {
        let hashedPass = HmacSHA256(password, result[0].PassSalt);
        return hashedPass === result[0].Password ? true : false;
    }
    return false;
}

/**
 * Get user information
 * @param username Tên đăng nhập
 */
const getUser = async (username: string): Promise<any> => {
    let query = `SELECT u.Id, UserName, Email, RoleName, u.CreatedDate FROM Users AS u, UserInRole AS uir, Roles AS r 
                WHERE UserName = '${username}' AND uir.UserId = u.Id AND r.Id = uir.RoleId`;
    let result = await sql.selectQuery(query);
    if (result.length === 1) {
        return {
            id: result[0].Id,
            username: result[0].UserName,
            email: result[0].Email,
            rolename: result[0].RoleName,
            createdDate: result[0].CreatedDate
        }
    }

    return null;
}

export default { signToken, validToken, getPayload, register, validUser, getUser };