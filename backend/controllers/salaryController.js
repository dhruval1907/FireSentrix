const Salary = require('../models/Salary');

exports.getAll = async (req, res, next) => {
    try {
        const salaries = await Salary.find().populate('guard', 'name phone salary').sort('-createdAt');
        res.status(200).json({ success: true, salaries });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const salary = await Salary.create(req.body);
        res.status(201).json({ success: true, salary });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!salary) return res.status(404).json({ success: false, message: 'Salary not found' });
        res.status(200).json({ success: true, salary });
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const salary = await Salary.findByIdAndDelete(req.params.id);
        if (!salary) return res.status(404).json({ success: false, message: 'Salary not found' });
        res.status(200).json({ success: true, message: 'Salary deleted' });
    } catch (err) {
        next(err);
    }
};
