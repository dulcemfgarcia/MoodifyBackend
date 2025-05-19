const User = require('../database/models/User.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const sequelize = require("../database/config.js");
const nodemailer = require('nodemailer');

require('dotenv').config();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const PEPPER = process.env.PEPPER;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FRONTEND_URL = process.env.FRONTEND_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

const registerUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        
        const { user, name, lastname, email, birthdate, password, idProfilePicture } = req.body;

        if (!user || !name || !lastname || !email || !birthdate || !password || !idProfilePicture) {
            return res.status(400).json({
                error: true,
                message: "The fields have not been filled in correctly."
            });
        }

        const formatBirthdate = new Date(`${birthdate}T00:00:00`);

        if (isNaN(formatBirthdate.getTime())) {
            await t.rollback();
            return res.status(400).json({
                error: true,
                message: "The birthdate field have not been filled in correctly.",
                data: null
            });
        }

        if (!validEmail(email)) {
            await t.rollback();
            return res.status(400).json({
                error: true,
                message: "The email field have not been filled in correctly.",
                data: null
            });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            user,
            name,
            lastname,
            email,
            birthdate: formatBirthdate,
            password: hashedPassword,
            idProfilePicture
        }, { transaction: t });

        const token = jwt.sign(
            { id: newUser.idUser, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        await t.commit();
        return res.status(201).json({
            error: false,
            message: "The user has been created successfully.",
            data: {
                idUser: newUser.idUser,
                user: newUser.user,
                idProfilePicture: newUser.idProfilePicture,
                token: token
            }
        });
    } catch (error) {
        await t.rollback();
        console.log(`Error: ${error}`);
        return res.status(500).json({
            error: true,
            message: "An unexpected error occurred, please try again later."
        });
    }
};

const restorePasswordRequest = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { email } = req.body;

        if (!validEmail(email)) {
            await t.rollback();
            return res.status(400).json({
                error: true,
                message: "The email field have not been filled in correctly.",
                data: null
            });
        }

        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            await t.rollback();
            return res.status(404).json({
                error: true,
                message: "The email does not exist.",
                data: null
            });
        }

        const token = jwt.sign(
            { id: user.idUser, email: user.email },
            JWT_SECRET,
            { expiresIn: '15m' }
        );
        
        const resetLink = `${FRONTEND_URL}?token=${token}`;

        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset password',
            html: `
            <h2>Hello, ${user.name}</h2>
            <p>Click the following link to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 15 minutes.</p>
            `
        });

        await t.commit();
        return res.status(201).json({
            error: false,
            message: "The email has been sent successfully.",
            data: null
        });
    } catch (error) {
        await t.rollback();
        console.log(`Error: ${error}`);
        return res.status(500).json({
            error: true,
            message: "An unexpected error occurred, please try again later."
        });
    }
}

const restoreNewPassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                error: true,
                message: "The fields have not been filled in correctly."
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'user not found'
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        await t.commit();
        return res.status(200).json({
            error: false,
            message: "The password has been reset successfully.",
            data: null
        });
    } catch (error) {
        await t.rollback();
        console.log(`Error: ${error}`);
        return res.status(500).json({
            error: true,
            message: "An unexpected error occurred, please try again later."
        });
    }
}

function validEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function hashPassword(passwordPlain) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const peppered = PEPPER + passwordPlain;
    return bcrypt.hash(peppered, salt);
}

module.exports = { registerUser, restorePasswordRequest, restoreNewPassword };