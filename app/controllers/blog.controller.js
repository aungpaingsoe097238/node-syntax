const Blog = require("../models").Blog;
const Tag = require("../models").Tag;
const User = require("../models").User;
const Profile = require("../models").Profile;
const Comment = require("../models").Comment;
const response = require("../helpers/response");
const db = require("../models");
const blogPolicy = require("../middlewares/policies/blogPolicy");

const blogAttributes = ["id", "title", "content", "authorId", "published"];
const tagAttributes = ["id", "name"];
const userAttributes = ["id", "name", "email", "profileId"];
const profileAttributes = ["id", "profileImage", "dob", "gender"];
const commentAttributes = ["id", "content", "userId"]

const index = async (req, res, next) => {
  const { keyword } = req.query;

  const scopes = [];

  if (keyword) {
    scopes.push(
      { method: ["published", true] },
      { method: ["search", keyword] }
    );
  } else {
    scopes.push({ method: ["published", true] });
  }

  try {
    const blogs = await Blog.scope(...scopes).findAll({
      attributes: blogAttributes,
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: tagAttributes,
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "author",
          attributes: userAttributes,
          include: {
            model: Profile,
            as: "profile",
            attributes: profileAttributes,
          },
        },
        {
          model: Comment,
          as: "comments",
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
        }
      ],
      order: [["id", "DESC"]],
    });
    return response.success(res, "Blog list successfully", blogs);
  } catch (error) {
    return response.error(res, "Blog list failed", error.message);
  }
};

const create = async (req, res, next) => {
  const { title, content, tagIds, published } = req.body;
  const t = await db.sequelize.transaction();
  try {
    const newBlog = await Blog.create(
      {
        title,
        content,
        authorId: req.user.id,
        published: published || false,
      },
      { transaction: t }
    );

    await newBlog.addTags(tagIds, { transaction: t });
    await t.commit();

    const blog = await Blog.findByPk(newBlog.id, {
      attributes: blogAttributes,
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: tagAttributes,
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "author",
          attributes: userAttributes,
          include: {
            model: Profile,
            as: "profile",
            attributes: profileAttributes,
          },
        },
      ],
    });

    return response.success(res, "Blog created successfully", blog);
  } catch (error) {
    await t.rollback();

    return response.error(res, "Blog created failed", error.message);
  }
};

const show = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existingBlog = await Blog.scope({
      method: ["published", true],
    }).findByPk(id, {
      attributes: blogAttributes,
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: tagAttributes,
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "author",
          attributes: userAttributes,
          include: {
            model: Profile,
            as: "profile",
            attributes: profileAttributes,
          },
        },
        {
          model: Comment,
          as: "comments",
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
          ],
        }
      ],
    });

    if (!existingBlog) {
      return response.error(
        res,
        "Blog detail failed",
        {
          blog: "Blog not found",
        },
        404
      );
    }

    return response.success(res, "Blog detail successfully", existingBlog);
  } catch (error) {
    return response.error(res, "Blog detail failed", error.message);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, tagIds, published } = req.body;
  const t = await db.sequelize.transaction();

  try {
    const existingBlog = await Blog.findByPk(id, { transaction: t });
    if (!existingBlog) {
      return response.error(
        res,
        "Blog updated failed",
        {
          blog: "Blog not found",
        },
        404
      );
    }

    const isOwner = blogPolicy.update(req, existingBlog);

    if (!isOwner) {
      await t.rollback();
      return response.error(
        res,
        "Blog updated failed",
        {
          token: "Unauthorized",
        },
        401
      );
    }

    await existingBlog.update({
      title: title || existingBlog.title,
      content: content || existingBlog.content,
      published: published || existingBlog.published,
    });

    if (tagIds && tagIds.length > 0) {
      await existingBlog.removeTags(await existingBlog.getTags(), {
        transaction: t,
      });
      await existingBlog.addTags(tagIds, { transaction: t });
    }

    await t.commit();

    const blog = await Blog.findByPk(existingBlog.id, {
      attributes: blogAttributes,
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: tagAttributes,
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "author",
          attributes: userAttributes,
          include: {
            model: Profile,
            as: "profile",
            attributes: profileAttributes,
          },
        },
      ],
    });

    return response.success(res, "Blog updated successfully", blog);
  } catch (error) {
    await t.rollback();
    return response.error(res, "Blog updated failed", error.message);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;
  const { force } = req.query;
  try {
    const existingBlog = await Blog.findByPk(id);

    if (!existingBlog) {
      return response.error(
        res,
        "Blog destroy failed",
        {
          blog: "Blog not found",
        },
        404
      );
    }

    const isOwner = blogPolicy.destroy(req, existingBlog);

    if (!isOwner) {
      return response.error(
        res,
        "Blog destroy failed",
        {
          token: "Unauthorized",
        },
        401
      );
    }

    if (force && force == true) {
      await existingBlog.destroy({
        force: true,
      });
    } else {
      await existingBlog.destroy();
    }

    return response.success(res, "Blog deleted successfully", {});
  } catch (error) {
    return response.error(res, "Blog deleted failed", error.message);
  }
};

const restore = async (req, res) => {
  const { id } = req.params;

  try {
    const restoreStatus = await Blog.restore({
      where: {
        id,
      },
    });

    if (restoreStatus == 0) {
      return response.error(res, "Failed to restore blog", {
        blog: "Restore blog not found",
      });
    }

    const restoreBlog = await Blog.findByPk(id);

    const isOwner = blogPolicy.restore(req, existingBlog);

    if (!isOwner) {
      return response.error(
        res,
        "Blog restore failed",
        {
          token: "Unauthorized",
        },
        401
      );
    }

    return response.success(res, "Blog restored successfully", restoreBlog);
  } catch (error) {
    return response.error(res, "Blog restored failed", error.message);
  }
};

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
  restore,
};
