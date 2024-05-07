const Tag = require("../models").Tag;
const Blog = require("../models").Blog;
const User = require("../models").User;
const response = require("../helpers/response");
const blogAttributes = ["id", "title", "content"];
const tagAttributes = ["id", "name"];

const index = async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      attributes: tagAttributes,
      include: [
        {
          model: Blog,
          as: "blogs",
          attributes: blogAttributes,
          through: {
            attributes: [],
          },
        },
      ],
    });
    return response.success(res, "Tag list successfully", tags);
  } catch (error) {
    return response.error(res, "Tag list failed", error.message);
  }
};

const show = async (req, res, next) => {
  const { id } = req.params;

  try {
    const tag = await Tag.findByPk(id, {
      attributes: tagAttributes,
      include: [
        {
          model: Blog,
          as: "blogs",
          attributes: blogAttributes,
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!tag) {
      return response.error(
        res,
        "Tag detail failed",
        {
          tag: "Tag not found",
        },
        404
      );
    }

    return response.success(res, "Tag detail successfully", tag);
  } catch (error) {
    return response.error(res, "Tag detail failed", error.message);
  }
};

module.exports = {
  index,
  show,
};
