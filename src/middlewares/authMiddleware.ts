import { Request, Response, NextFunction } from "express";
import auth from '../services/authService';

/**
 * Check authention from client request
 * @param req 
 * @param res 
 * @param next 
 */
const validUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/login' || req.url === '/logout' || req.url === '/register') {
        next();
    } else {
        const unauthorized = {
            ok: false,
            status: 401,
            message: 'User was not authorzied'
        }

        const requestHeader = 'Authorization';

        // read token from 'Authorization' header
        // e.g: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
        let token: any = req.header(requestHeader);

        if (!token || token === null || token.length === 0) {
            res.status(401).json(unauthorized);
            return;
        }

        if (token.startsWith('Bearer')) {
            token = token.remove('Bearer').trim();
        }

        if (!auth.validToken(token)) {
            res.status(401).json(unauthorized);
            return;
        }
        next();
    }
}

export default { validUser };