const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    return res.status(403).json({ message: 'Ro\'yxatdan o\'tish tizim ma\'muri tomonidan to\'xtatilgan' });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email yoki parol noto\'g\'ri' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
