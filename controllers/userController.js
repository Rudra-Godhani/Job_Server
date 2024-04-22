const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {

    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({
                status: false,
                msg: "Username already used"
            })
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({
                status: false,
                msg: "Email already used"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email, username, password: hashPassword,
        });
        delete user.password;
        return res.json({
            status: true,
            user
        });
    }
    catch (error) {
        next(error);
    }

}

module.exports.login = async (req, res, next) => {

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.json({
                status: false,
                msg: "Incorrect username"
            })
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({
                status: false,
                msg: "Incorrect password"
            })
        delete user.password;
        return res.json({
            status: true,
            user
        });
    }
    catch (error) {
        next(error);
    }

}

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });

    } catch (err) {
        next(err);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select({
            email: true,
            username: true,
            avatarImage: true,
            _id: true
        })

        return res.json(users);
    } catch (err) {
        next(err);
    }
}