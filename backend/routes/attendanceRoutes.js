const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { mark, getByDate, getByGuard } = require('../controllers/attendanceController');

router
    .route('/')
    .get(protect, getByDate)
    .post(
        protect,
        [
            body('guard').notEmpty().withMessage('Guard ID is required'),
            body('site').notEmpty().withMessage('Site ID is required'),
            body('date').notEmpty().withMessage('Date is required'),
            body('status').isIn(['present', 'absent']).withMessage('Status must be present or absent'),
            validate,
        ],
        mark
    );

router.get('/guard/:guardId', protect, getByGuard);

module.exports = router;
