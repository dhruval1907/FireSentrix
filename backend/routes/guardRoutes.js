const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/guardController');

router
    .route('/')
    .get(protect, getAll)
    .post(
        protect,
        [
            body('name').notEmpty().withMessage('Name is required'),
            body('phone').notEmpty().withMessage('Phone is required'),
            validate,
        ],
        create
    );

router.route('/:id').patch(protect, update).delete(protect, remove);

module.exports = router;
