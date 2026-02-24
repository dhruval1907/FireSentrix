const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/siteController');

router
    .route('/')
    .get(protect, getAll)
    .post(
        protect,
        [
            body('siteName').notEmpty().withMessage('Site name is required'),
            body('location').notEmpty().withMessage('Location is required'),
            body('client').notEmpty().withMessage('Client is required'),
            validate,
        ],
        create
    );

router.route('/:id').patch(protect, update).delete(protect, remove);

module.exports = router;
