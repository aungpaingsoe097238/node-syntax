"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blog.belongsTo(models.User, {
        foreignKey: "authorId",
        as: "author",
      });
      Blog.belongsToMany(models.Tag, {
        through: models.BlogTag,
        foreignKey: "blogId",
        as: "tags",
      });
      Blog.hasMany(models.Comment, {
        foreignKey: "blogId",
        as: "comments",
      });
    }
  }

  Blog.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      authorId: DataTypes.INTEGER,
      published: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Blog",
      paranoid: true,
      defaultScope: {
        //
      },
      scopes: {
        published: (status) => ({
          where: {
            published: status,
          },
        }),
        search: (keyword) => ({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${keyword}%` } },
              { content: { [Op.like]: `%${keyword}%` } },
            ],
          },
        }),
      },
    }
  );

  Blog.beforeCreate((blog, options) => {
    //
  });

  Blog.beforeDestroy((blog, options) => {
    //
  });

  return Blog;
};
