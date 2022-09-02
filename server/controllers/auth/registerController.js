const { User } = require("../../model/User");
const bcrypt = require("bcrypt");

const handleRegist = async (req, res) => {
  const { name, userId, password, company, email } = req.body;

  if (!name || !userId || !password || !company || !email)
    return res.status(400).json({ message: "All input required" });

  const duplicate = await User.findOne({ userId }).exec();
  if (duplicate)
    return res.status(409).json({ message: "usename is duplicated" });

  try {
    const hasedPwd = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      userId,
      password: hasedPwd,
      company,
      email,
    });

    res.status(201).json({
      success: true,
      message: `New user ID : ${userId} created!`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `fail create user` });
  }
};

module.exports = { handleRegist };
