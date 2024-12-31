import { Router } from 'express';
import users from '../../modules/users/usersAPI';
import urls from '../../modules/slugs/slugsAPI';

const router = Router();
router.use('/users', users);
router.use('/urls', urls);

export default router;
