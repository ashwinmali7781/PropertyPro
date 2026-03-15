/**
 * Wraps an async route handler and passes any errors to Express next()
 * Eliminates the need for try-catch in every route
 */
const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = wrapAsync;
