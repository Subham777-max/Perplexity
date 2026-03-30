import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Error");
    err.status = 400;
    err.errors = errors.array();
    return next(err);
  }

  next();
};

export default validate;