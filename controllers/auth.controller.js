const User = require('../database/models/User.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

require('dotenv').config();
const PEPPER = process.env.PEPPER;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

const login = async (req, res, next) => {
    try {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(400).json({
                error: true,
                message: "The fields have not been filled in correctly.",
                data: null
            });
        }

        const modelUser = await User.findOne({ where: { user: user } });

        if (!modelUser) {
            return res.status(401).json({
                error: true,
                message: "Invalid user or password.",
                data: null
            });
        }

        const isValidPassword = await comparePassword(password, modelUser.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: true,
                message: "Invalid user or password.",
                data: null
            });
        }

        const token = jwt.sign(
            { id: modelUser.idUser, email: modelUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        return res.status(200).json({
            error: false,
            message: "Login successful.",
            data: {
                idUser: modelUser.idUser,
                user: modelUser.user,
                idProfilePicture: modelUser.idProfilePicture,
                token: token
            }
        });
    } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(500).json({
            error: true,
            message: "An unexpected error occurred, please try again later.",
            data: null
        });
    }
};

async function comparePassword(passwordPlain, hashStored) {
  const peppered = PEPPER + passwordPlain;
  return await bcrypt.compare(peppered, hashStored);
}

module.exports = { login };