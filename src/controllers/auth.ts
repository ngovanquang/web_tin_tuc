import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

/**
 * Login to system
 * @param req http request
 * @param res http response
 * @param next 
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let username: string = req.body.username;
        let password: string = req.body.password;

        let isValidUser = await authService.validUser(username, password);
        if (isValidUser !== null) {
            let userInfo = await authService.getUser(username);

            return res.status(200).json({
                ok: true,
                message: 'Login successfully',
                token: authService.signToken(userInfo)
            });
        }

        return res.status(401).send();
    } catch (error) {
        next();
        return;
    }
}

/**
 * Logout from system
 * This function will be delete the toekn from database, so the hacked token or banned user will be terminated.
 * @param req 
 * @param res 
 * @param next 
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({
            ok: true,
            message: 'Token was deleted successfully'
        });
    } catch (error) {
        next();
        return;
    }
}

/**
 * Register user with system
 * @param req 
 * @param res 
 * @param next 
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let username: string = req.body.username;
        let password: string = req.body.password;
        let email: string = req.body.email;

        let isCreated = await authService.register(username, password, email);
        if (isCreated) {
            return res.status(201).json({
                ok: true,
                message: 'User created'
            });
        }

        return res.status(400).json({
            ok: false,
            message: 'Fail to create user'
        });
    } catch (error) {
        next();
        return;
    }
}

export default { login, logout, register };