function getUserInfo(user) {
  return {
    role: user.role,
    email: user.email,
    name: user.name,
    question: user.question,
    phone: user.phone,
    id: user.id || user._id,
  };
}

module.exports = getUserInfo;
