function getUserInfo(user) {
  return {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    id: user.id || user._id,
  };
}

module.exports = getUserInfo;
