export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).send({
      message: error.details[0].message
    })
  }

  next();
};
