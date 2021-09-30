import { Request, Response, NextFunction } from 'express';
import roleService from '../services/roleService';


/**
 * Add a new role to database
 * @param req
 * @param res
 * @param next
 * @returns
 */
const addNewRole = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const roleName: string = req.body.roleName;
        const description: string = req.body.description;

        const role = await roleService.addRole(roleName, description);

        if (role) {
            return res.status(200).json({
                ok: true,
                message: 'Success',
                product: role
            });
        }
        return res.status(404);
    } catch (error) {
        next();
        return;
    }
}

/**
 * Get a role from Database
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = +req.body.roleId;
        const result = await roleService.getRole(roleId);
        if (result.length === 1) {
            return res.status(200).json({
                ok: true,
                message: 'Success',
                id: result[0].Id,
                RoleName: result[0].RoleName,
                Description: result[0].Description,
                createdDate: result[0].CreatedDate
            });
        }
        return res.status(404);
    } catch (error) {
        next();
        return;
    }
}

export default { addNewRole, getRole };