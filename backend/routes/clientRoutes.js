const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/clientController');

router
    .route('/')
    .get(protect, getAll)
    .post(
        protect,
        [
            body('clientName').notEmpty().withMessage('Client name is required'),
            body('companyName').notEmpty().withMessage('Company name is required'),
            body('contactPhone').notEmpty().withMessage('Contact phone is required'),
            validate,
        ],
        create
    );

router.route('/:id').patch(protect, update).delete(protect, remove);

module.exports = router;
