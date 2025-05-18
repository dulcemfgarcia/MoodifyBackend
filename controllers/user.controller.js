const User = require('../database/models/User.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const sequelize = require("../database/config.js");

require('dotenv').config();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const PEPPER = process.env.PEPPER;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

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

function validEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function hashPassword(passwordPlain) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const peppered = PEPPER + passwordPlain;
    return bcrypt.hash(peppered, salt);
}

module.exports = { registerUser };