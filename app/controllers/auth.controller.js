const db = require("../models");
const User = require("../models").User;
const Profile = require("../models").Profile;
const bcrypt = require("../helpers/bcrypt");
const jwt = require("../helpers/jwt");
const response = require("../helpers/response");

const profileAttributes = ["id", "profileImage", "dob"];
const userAttributes = ["id", "name", "email", "profileId"];

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email },
      include: {
        model: Profile,
        as: "profile",
        attributes: profileAttributes,
      },
    });

    if (!existingUser) {
      return response.error(res, "Invalid Credentails", {
        user: "Invalid user",
      });
    }

    const isMatch = bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return response.error(res, "Invalid Credentails", {
        password: "Invalid password",
      });
    }

    const user = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      profile: existingUser.profile,
      token: jwt.generate(existingUser.email),
    };

    return response.success(res, "User sign in successfully", user);
  } catch (error) {
    return response.error(res, "Invalid Credentails", {
      server: error.message,
    });
  }
};

const signUp = async (req, res, next) => {
  const t = await db.sequelize.transaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      where: { name },
    });

    if (existingUser) {
      await t.rollback();
      return response.error(res, "Invalid Credentails", {
        user: "User already exists",
      });
    }

    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      await t.rollback();
      return response.error(res, "Invalid Credentails", {
        email: "Email already exists",
      });
    }

    const newProfile = await Profile.create(
      {
        profileImage: "",
        dob: "",
        gender: "",
      },
      { transaction: t }
    );

    const newUser = await User.create(
      {
        name,
        email,
        password: bcrypt.hash(password),
        profileId: newProfile.id,
        attributes: userAttributes,
      },
      { transaction: t }
    );

    const user = await User.findByPk(newUser.id, {
      attributes: userAttributes,
      include: {
        model: Profile,
        as: "profile",
        attributes: profileAttributes,
      },
      transaction: t,
    });

    await t.commit();
    return response.success(res, "User sign up successfully", user);
  } catch (error) {
    await t.rollback();
    return response.error(res, "User sign up failed", {
      server: error.message,
    });
  }
};

module.exports = {
  signIn,
  signUp,
};
