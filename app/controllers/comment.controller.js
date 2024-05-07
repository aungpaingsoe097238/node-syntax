const Comment = require("../models").Comment;
const User = require("../models").User;
const Blog = require("../models").Blog;
const Profile = require("../models").Profile;
const response = require("../helpers/response");
const commentPolicy = require("../middlewares/policies/commentPolicy");

const commentAttributes = ["id", "content", "userId", "blogId"];
const blogAttributes = ["id", "title", "content", "authorId", "published"];
const userAttributes = ["id", "name", "email", "profileId"];
const profileAttributes = ["id", "profileImage", "dob", "gender"];

const create = async (req, res) => {
  const { content, blogId } = req.body;

  try {
    const newComment = await Comment.create({
      content,
      blogId,
      userId: req.user.id,
    });

    const comment = await Comment.findByPk(newComment.id, {
      attributes: commentAttributes,
      include: [
        {
          model: User,
          as: "user",
          attributes: userAttributes,
          include: {
            model: Profile,
            as: "profile",
            attributes: profileAttributes,
          },
        },
        {
          model: Blog,
          as: "blog",
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

    return response.success(res, "Comment created successfully", comment);
  } catch (error) {
    return response.error(res, "Comment created failed", {
      server: error.message,
    });
  }
};

const show = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByPk(id, {
      attributes: commentAttributes,
      include: [
        {
          model: User,
          as: "user",
          attributes: userAttributes,
          include: {
            model: Profile,
            as: "profile",
            attributes: profileAttributes,
          },
        },
        {
          model: Blog,
          as: "blog",
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

    if (!comment) {
      response.error(res, "Comment detail failed", {
        comment: "Comment not found",
      });
    }

    return response.success(res, "Comment detail successfully", comment);
  } catch (error) {
    return response.error(res, "Comment detail failed", {
      server: error.message,
    });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const existingComment = await Comment.findByPk(id);

    if (!existingComment) {
      return response.error(res, "Comment update failed", {
        comment: "Comment not found",
      });
    }

    const isOwner = commentPolicy.update(req, existingComment);

    if (!isOwner) {
      return response.error(res, "Comment update failed", {
        token: "Unauthorized",
      });
    }

    await existingComment.update({
      content: content || existingComment.comment,
    });

    const comment = await Comment.findByPk(id, {
      attributes: commentAttributes,
      include: [
        {
          model: User,
          as: "user",
          attributes: userAttributes,
          include: {
            model: Profile,
            as: "profile",
            attributes: profileAttributes,
          },
        },
        {
          model: Blog,
          as: "blog",
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

    return response.success(res, "Comment updated successfully", comment);
  } catch (error) {
    return response.error(res, "Comment update failed", {
      server: error.message,
    });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteComment = await Comment.findByPk(id);

    if (!deleteComment) {
      return response.error(res, "Comment not found", {
        comment: "Comment not found",
      });
    }

    const isOwner = commentPolicy.destroy(req, deleteComment);

    if (!isOwner) {
      return response.error(res, "Comment delete failed", {
        token: "Unauthorized",
      });
    }

    await deleteComment.destroy();

    return response.success(res, "Comment deleted successfully", {});
  } catch (error) {
    return response.error(res, "Comment delete failed", {
      server: error.message,
    });
  }
};

module.exports = {
  create,
  show,
  update,
  destroy,
};
