const { User } = require("../../model/User");

const handleFetchUser = async (req, res) => {
  const foundUser = await User.find({}).exec();
  res.json(foundUser);
};

module.exports = { handleFetchUser };
