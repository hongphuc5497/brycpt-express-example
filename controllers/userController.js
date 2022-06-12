require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const models = require('../models');
const jwt = require('jsonwebtoken');

import { saltRounds } from '../exports';
import { authCheck } from '../middlewares/authCheck';

router.post('/signin', async (req, res, next) => {
	const secret = process.env.JWT_SECRET;
	const { username, password } = req.body;

	if (!username || !password) {
		return res.send({
			error: 'User name and password required',
		});
	}

	const user = await models.User.findOne({
		where: {
			username,
		},
	});
	if (!user) {
		return res.status(401).send({
			error: 'Invalid username or password',
		});
	}

	try {
		const compareRes = await bcrypt.compare(password, user.hashedPassword);
		if (compareRes) {
			const token = jwt.sign(
				{
					data: {
						username,
						userId: user.id,
					},
				},
				secret,
				{ expiresIn: 60 * 60 }
			);
			return res.send({ token });
		} else {
			return res.status(401).send({
				error: 'Invalid username or password',
			});
		}
	} catch (ex) {
		next(ex);
	}
});

router.post('/signup', async (req, res, next) => {
	const { username, password, email } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		await models.User.create({
			username,
			email,
			hashedPassword,
		});

		return res.send({ message: 'User created' });
	} catch (ex) {
		next(ex);
	}
});

router.put('/update-user', authCheck, async (req, res, next) => {
	const { username, email } = req.body;
	const token = req.headers.authorization;
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const userId = decoded.data.userId;

	try {
		await models.User.update(
			{
				username,
				email,
			},
			{
				where: {
					id: userId,
				},
			}
		);

		return res.send({ message: 'User created' });
	} catch (ex) {
		next(ex);
	}
});

router.put('/update-password', authCheck, async (req, res, next) => {
	const { password } = req.body;
	const token = req.headers.authorization;
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const userId = decoded.data.userId;

	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		await models.User.update(
			{
				hashedPassword,
			},
			{
				where: {
					id: userId,
				},
			}
		);

		return res.send({ message: 'User created' });
	} catch (ex) {
		next(ex);
	}
});

module.exports = router;
