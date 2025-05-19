function getUserInfo(user) {
  return {
    role: user.role,
    email: user.email,
    name: user.name,
    id: user.id || user._id,
  };
}

module.exports = getUserInfo;
