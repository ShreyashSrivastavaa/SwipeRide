const verifyUser = async (req, res, next) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        if (!user.isEmailVerified && !user.isPhoneVerified) {
            return res.status(403).json({
                msg: 'Please verify your email or phone to access this route',
            })
        }

        next()
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
}

module.exports = verifyUser
