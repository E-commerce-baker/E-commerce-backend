const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { User } = require("../models/UserModel");

exports.checkpassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found.",
      });
    }
    const token = jwt.sign(
      { email: user.email },
      process.env.SECRET_KEY + user.password,
      { expiresIn: "1h" }
    );
    const resetLink = `${process.env.HOST}/api/resetpassword/${encodeURIComponent(email)}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      text: `Click ${resetLink} to reset your password.`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: `error: ${error}`,
    });
  }
};

exports.resetpassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.render("email", { error: "User not found." });
  }
  try {
    const verify = await jwt.verify(
      req.params.token,
      process.env.SECRET_KEY + user.password
    );
    res.render("resetpassword", { error: "" });
  } catch (error) {
    return res.render("email", { error: "Invalid token." });
  }
};

exports.updateresetpassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.render("email", { error: "User not found." });
  }
  try {
    if (password !== confirmPassword) {
      return res.render("resetpassword", { error: "Passwords do not match." });
    }
    await jwt.verify(req.params.token, process.env.SECRET_KEY + user.password);
    await User.updateOne({ email: req.params.email }, { password });
    res.render("success", {
      success: "Password updated successfully.",
    });
  } catch (error) {
    return res.render("email", { error: "Invalid token." });
  }
};
