const Attendance = require('../models/Attendance');

// POST /api/v1/attendance
exports.mark = async (req, res, next) => {
    try {
        const { guard, site, date, status } = req.body;

        let record = await Attendance.findOne({ guard, date: new Date(date) });

        if (record) {
            record.status = status;
            await record.save();
        } else {
            record = await Attendance.create({ guard, site, date: new Date(date), status });
        }

        res.status(200).json({ success: true, record });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/attendance?date=YYYY-MM-DD
exports.getByDate = async (req, res, next) => {
    try {
        const { date } = req.query;
        const filter = {};
        if (date) {
            const d = new Date(date);
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            filter.date = { $gte: d, $lt: next };
        }
        const records = await Attendance.find(filter)
            .populate('guard', 'name phone')
            .populate('site', 'siteName')
            .sort('guard');
        res.status(200).json({ success: true, records });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/attendance/guard/:guardId
exports.getByGuard = async (req, res, next) => {
    try {
        const records = await Attendance.find({ guard: req.params.guardId })
            .populate('site', 'siteName')
            .sort('-date');
        res.status(200).json({ success: true, records });
    } catch (err) {
        next(err);
    }
};
