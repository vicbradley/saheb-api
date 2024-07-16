export const checkUserValidity = async (req, res, next) => {
  if (req.params.userId !== req.userId) {
    return res.status(401).send({ message: "User is not the owner!" });
  }

  next();
};

