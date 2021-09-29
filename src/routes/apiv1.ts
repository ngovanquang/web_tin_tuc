import express from 'express';
import authController from '../controllers/auth';
import roleControler from '../controllers/roles';
const router = express.Router();

/**
 * Auth
 */
router.get('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register', authController.register);


/**
 * Role
 */

router.post('/roles/add', roleControler.addNewRole);
router.get('/roles/get', roleControler.getRole);
export = router;