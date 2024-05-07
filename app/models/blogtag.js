'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BlogTag.belongsTo(models.Blog, {
        foreignKey: "blogId",
        as: "blog",
      });
      BlogTag.belongsTo(models.Tag, {
        foreignKey: "tagId",
        as: "tag",
      });
    }
  }
  BlogTag.init({
    blogId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BlogTag',
  });
  return BlogTag;
};