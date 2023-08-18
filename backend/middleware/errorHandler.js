const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const newArr = [];

  const code = 409;
  const error = `An account with that ${field} already exists.`;
  newArr.push({ [field]: error });

  err = newArr;
  res.status(code).send(err);
};

const handleValidationError = (err, res) => {
  const fields = Object.keys(err.errors);
  const newErr = [];

  for (let i = 0; i < fields.length; i++) {
    const property = Object.values(err.errors[fields[i]]);
    const field = property[0].path;
    const message = property[0].message;
    newErr.push({ [field]: message });
  }
  err = newErr;
  res.status(400).json(err);
};

const errorHandler = (err, req, res, next) => {
  // res.json(err);
  try {
    if (err.name === "ValidationError") {
      err = handleValidationError(err, res);
      return next(err);
    } else if (err.code && err.code == 11000) {
      err = handleDuplicateKeyError(err, res);
      return next(err);
    }
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

module.exports = errorHandler;
