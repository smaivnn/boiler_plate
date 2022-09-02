const { User } = require("../../model/User");

const handleFetchUser = async (req, res) => {
  const foundUser = await User.find({}).exec();
  try {
    res.json(foundUser);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { handleFetchUser };
