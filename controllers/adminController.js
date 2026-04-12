// controllers/adminController.js

const { StatusCodes } = require('http-status-codes')
const Admin = require('../models/Admin')
const Driver = require('../models/Driver')
const { NotFoundError } = require('../errors')

// Get Admin Profile
const getAdminProfile = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password')
        if (!admin) {
            throw new NotFoundError('Admin not found')
        }
        res.status(StatusCodes.OK).json({ success: true, data: admin })
    } catch (error) {
        next(error)
    }
}

// Suspend or Unsuspend Driver
const suspendDriver = async (req, res, next) => {
    const { id } = req.params
    const { suspend } = req.body // Boolean: true to suspend, false to unsuspend

    try {
        const driver = await Driver.findById(id)
        if (!driver) {
            throw new NotFoundError('Driver not found')
        }

        driver.suspended = suspend
        await driver.save()

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Driver ${suspend ? 'suspended' : 'unsuspended'} successfully`,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAdminProfile,
    suspendDriver,
}
