const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/equipmentController');

router
    .route('/')
    .get(protect, getAll)
    .post(
        protect,
        [
            body('name').notEmpty().withMessage('Equipment name is required'),
            body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
            validate,
        ],
        create
    );

router.route('/:id').patch(protect, update).delete(protect, remove);

module.exports = router;
