const Guard = require('../models/Guard');
const Site = require('../models/Site');

exports.getAll = async (req, res, next) => {
    try {
        const guards = await Guard.find().populate('assignedSite', 'siteName location').sort('-createdAt');
        res.status(200).json({ success: true, guards });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const guard = await Guard.create(req.body);

        // Add guard to site's guards array
        if (guard.assignedSite) {
            await Site.findByIdAndUpdate(guard.assignedSite, { $addToSet: { guards: guard._id } });
        }

        res.status(201).json({ success: true, guard });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const oldGuard = await Guard.findById(req.params.id);
        const guard = await Guard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!guard) return res.status(404).json({ success: false, message: 'Guard not found' });

        // Update site references if assignedSite changed
        if (oldGuard && String(oldGuard.assignedSite) !== String(guard.assignedSite)) {
            if (oldGuard.assignedSite) await Site.findByIdAndUpdate(oldGuard.assignedSite, { $pull: { guards: guard._id } });
            if (guard.assignedSite) await Site.findByIdAndUpdate(guard.assignedSite, { $addToSet: { guards: guard._id } });
        }

        res.status(200).json({ success: true, guard });
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const guard = await Guard.findByIdAndDelete(req.params.id);
        if (!guard) return res.status(404).json({ success: false, message: 'Guard not found' });
        if (guard.assignedSite) await Site.findByIdAndUpdate(guard.assignedSite, { $pull: { guards: guard._id } });
        res.status(200).json({ success: true, message: 'Guard deleted' });
    } catch (err) {
        next(err);
    }
};
