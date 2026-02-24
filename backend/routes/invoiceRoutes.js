const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getAll, create, markPaid, remove } = require('../controllers/invoiceController');

router
    .route('/')
    .get(protect, getAll)
    .post(
        protect,
        [
            body('client').notEmpty().withMessage('Client ID is required'),
            body('amount').isNumeric().withMessage('Amount must be a number'),
            body('month').notEmpty().withMessage('Month is required'),
            validate,
        ],
        create
    );

router.patch('/:id/pay', protect, markPaid);
router.delete('/:id', protect, remove);

module.exports = router;
