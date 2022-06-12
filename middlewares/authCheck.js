require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

export const authCheck = (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				return res.status(401).send({ error: 'Unauthorized' });
			}
			next();
		});
	} else {
		return res.status(401).send({
			error: 'No authorization header',
		});
	}
};
