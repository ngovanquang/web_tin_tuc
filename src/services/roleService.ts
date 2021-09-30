import sql from '../common/sqlConnection';
import moment from 'moment';

/**
 * Get role by roleId
 * @param roleId
 * @returns
 */
const getRole = async (roleId:number): Promise<any> => {
    let query = `SELECT Id, RoleName, Description, CreatedDate From Roles WHERE Id = '${roleId}'`;
    return await sql.selectQuery(query);
}

/**
 * Add a role
 * @param roleName
 * @param description
 * @returns
 */
const addRole = async (roleName:string, description: string): Promise<boolean> => {
    const createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = `INSERT INTO Roles (RoleName, Description, CreatedDate) VALUES ('${roleName}', '${description}', '${createdDate}')`;
    const result = await sql.executeQuery(query);
    return result > 0 ? true : false;
}

export default { getRole, addRole };