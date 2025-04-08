function getTokenFromHeader(headers) {
  if (!!!headers && !!!headers.authorization) return null;

  try {
    const parted = headers.authorization.split(" ");
    if (parted.length === 2) return parted[1];
    return null;
  } catch (error) {
    return null;
  }
 
}

module.exports = getTokenFromHeader;