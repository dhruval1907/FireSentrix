const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/salaryController');

router
    .route('/')
    .get(protect, getAll)
    .post(
        protect,
        [
            body('guard').notEmpty().withMessage('Guard ID is required'),
            body('month').notEmpty().withMessage('Month is required'),
            body('totalDaysPresent').isNumeric().withMessage('Total days present must be a number'),
            body('totalSalary').isNumeric().withMessage('Total salary must be a number'),
            validate,
        ],
        create
    );

router.route('/:id').patch(protect, update).delete(protect, remove);

module.exports = router;
