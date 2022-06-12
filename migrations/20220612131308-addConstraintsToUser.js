'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await Promise.all([
			queryInterface.addConstraint('Users', {
				fields: ['email'],
				type: 'unique',
				name: 'users_email_unique',
			}),
			queryInterface.addConstraint('Users', {
				fields: ['username'],
				type: 'unique',
				name: 'users_username_unique',
			}),
		]);
	},

	async down(queryInterface, Sequelize) {
		await Promise.all([
			queryInterface.removeConstraint('Users', 'users_username_unique'),
			queryInterface.removeConstraint('Users', 'users_email_unique'),
		]);
	},
};
