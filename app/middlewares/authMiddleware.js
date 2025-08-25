exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.redirect('/client/themes'); // ou page "accès refusé"
};
