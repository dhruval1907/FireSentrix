const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getAll, send } = require('../controllers/messageController');

router
    .route('/')
    .get(protect, getAll)
    .post(
        protect,
        [
            body('senderName').notEmpty().withMessage('Sender name is required'),
            body('message').notEmpty().withMessage('Message is required'),
            validate,
        ],
        send
    );

module.exports = router;
