"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tags = [
      "Art",
      "Programming",
      "Ai",
      "Life",
      "Nature",
      "Education",
      "Knowledge",
      "Medical",
      "Totips",
    ];

    await Promise.all(
      tags.map(async (tag) => {
        await queryInterface.bulkInsert(
          "Tags",
          [
            {
              name: tag,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tags", null, {});
  },
};
