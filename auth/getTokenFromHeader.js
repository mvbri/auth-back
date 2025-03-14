function getTokenFromHeader(headers) {
  if (!!!headers && !!!headers.authorization) return null;

  const parted = headers.authorization.split(" ");
  if (parted.length === 2) return parted[1];
  return null;
}

module.exports = getTokenFromHeader;
