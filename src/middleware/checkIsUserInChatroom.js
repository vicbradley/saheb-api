export const checkIsUserInChatroom = async (req, res, next) => {
  if (req.query.mainUserId !== req.userId) return res.status(401).send({ message: "Invalid User!" });

  next();
};
