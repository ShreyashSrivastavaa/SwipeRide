const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const { protect } = require('../middleware')
const User = require('../models/User')
const Driver = require('../models/Driver')

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

router.post('/', protect, async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new BadRequestError('No file was uploaded')
        }

        const uploadedFile = req.files.image || req.files.file || Object.values(req.files)[0]

        // Validate image MIME type
        if (!uploadedFile.mimetype.startsWith('image/')) {
            throw new BadRequestError('Please upload an image file (JPEG, PNG, WEBP, etc.)')
        }

        // Limit size to 5MB
        const maxSize = 5 * 1024 * 1024
        if (uploadedFile.size > maxSize) {
            throw new BadRequestError('Image size cannot exceed 5MB')
        }

        // Generate clean unique filename
        const ext = path.extname(uploadedFile.name) || '.jpg'
        const safeName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`
        const uploadPath = path.join(uploadDir, safeName)

        await uploadedFile.mv(uploadPath)

        const fileUrl = `/uploads/${safeName}`

        // If user wants to auto-update profilePicture:
        if (req.body.updateProfile === 'true' || req.body.updateProfile === true) {
            const userId = req.user._id || req.user.id
            if (req.user.role === 'user') {
                await User.findByIdAndUpdate(userId, { profilePicture: fileUrl })
            } else if (req.user.role === 'driver') {
                await Driver.findByIdAndUpdate(userId, { profilePicture: fileUrl })
            }
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Image uploaded successfully',
            url: fileUrl,
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
