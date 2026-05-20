const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.').replace('body.', ''),
        message: err.message,
      }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    next(error);
  }
};

module.exports = validate;
