const db = require("../models");
const User = require("../models").User;
const Profile = require("../models").Profile;
const response = require("../helpers/response");
const userPolicy = require("../middlewares/policies/userPolicy");

const userAttributes = ["id", "name", "email", "profileId"];
const profileAttributes = ["id", "profileImage", "dob", "gender"];

const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: userAttributes,
      include: {
        model: Profile,
        as: "profile",
        attributes: profileAttributes,
      },
    });

    return response.success(res, "Profile detail successfully", user);
  } catch (error) {
    return response.error(res, "Profile detail failed", {
      server: error.message,
    });
  }
};

const update = async (req, res, next) => {
  const { name, email, profileImage, dob, gender } = req.body;
  const t = await db.sequelize.transaction();

  try {
    const existingUser = await User.findByPk(req.user.id);
    const isOwner = userPolicy.update(req, existingUser);

    if (!isOwner) {
      await t.rollback();
      return response.error(
        res,
        "Profile updated failed",
        {
          token: "Unauthorized",
        },
        404
      );
    }

    if (!existingUser) {
      return response.error(
        res,
        "Profile updated failed",
        {
          token: "Invalid token",
        },
        404
      );
    }

    await existingUser.update(
      {
        name: name || existingUser.name,
        email: email || existingUser.email,
      },
      { transaction: t }
    );

    const existingProfile = await Profile.findByPk(existingUser.profileId);

    await existingProfile.update(
      {
        profileImage: profileImage || existingUser.profile.profileImage,
        dob: dob || existingUser.profile.dob,
        gender: gender || existingUser.profile.gender,
      },
      { transaction: t }
    );

    await t.commit();

    const updatingUser = await User.findByPk(existingUser.id, {
      attributes: userAttributes,
      include: {
        model: Profile,
        as: "profile",
        attributes: profileAttributes,
      },
    });

    return response.success(res, "Profile updated successfully", updatingUser);
  } catch (error) {
    await t.rollback();
  }
};

module.exports = {
  me,
  update,
};
