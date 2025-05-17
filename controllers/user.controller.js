const { json, format } = require('express/lib/response.js');
const sequelize = require('../database/config.js');
const User = require('../database/models/User.js');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

require('dotenv').config();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const PEPPER = process.env.PEPPER;

const registerUser = async (req, res, next) => {
    try {
        const { user, name, lastname, email, birthdate, password, idProfilePicture } = req.body;

        if (!user || !name || !lastname || !email || !birthdate || !password || !idProfilePicture) {
            return res.status(400).json({
                error: true,
                message: "The fields have not been filled in correctly."
            });
        }

        const [day, month, year] = birthdate.split('/');
        formatBirthdate = new Date(`${year}-${month}-${day}T00:00:00`);

        if (isNaN(formatBirthdate)) {
            return res.status(400).json({
                error: true,
                message: "The birthdate field have not been filled in correctly.",
                data: null
            });
        }

        if (!validEmail(email)) {
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
        });

        return res.status(201).json({
            error: false,
            message: "The user has been created successfully.",
            data: newUser
        });
    } catch (error) {
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

async function comparePassword(passwordPlain, hashStored) {
  const peppered = PEPPER + passwordPlain;
  return await bcrypt.compare(peppered, hashStored);
}

module.exports = { registerUser };