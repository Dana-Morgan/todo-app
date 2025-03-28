const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const verifyCsrfToken = (req, res, next) => {
  csrfProtection(req, res, (err) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired CSRF token' });
    }
    next();
  });
};

module.exports = { csrfMiddleware: csrfProtection, verifyCsrfToken };
