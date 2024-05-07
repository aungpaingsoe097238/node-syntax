const User = require("../models").User;
const Blog = require("../models").Blog;
const Profile = require("../models").Profile;
const response = require("../helpers/response");

const userAttributes = ["id", "name", "email", "profileId"];
const profileAttributes = ["id", "profileImage", "dob", "gender"];
const blogAttributes = ["id", "title", "content", "authorId"];

const index = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: userAttributes,
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: profileAttributes,
        },
      ],
      order: [["id", "DESC"]],
    });
    return response.success(res, "User list successfully", users);
  } catch (error) {
    return response.error(res, "User list failed", error.message);
  }
};

const show = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: userAttributes,
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: profileAttributes,
        },
        {
          model: Blog,
          as: "blogs",
          attributes: blogAttributes,
          include: {
            model: User,
            as: "author",
            attributes: userAttributes,
            include: {
              model: Profile,
              as: "profile",
              attributes: profileAttributes,
            },
          },
        },
      ],
    });

    if (!user) {
      return next(new Error("User not found"));
    }

    return response.success(res, "User detail successfully", user);
  } catch (error) {
    return response.error(res, "User detail failed", {
      server: error.message,
    });
  }
};

module.exports = {
  index,
  show,
};
