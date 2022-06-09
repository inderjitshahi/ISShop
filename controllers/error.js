

export function get404(req, res, next) {
    res.status(404).render('404', {
        path: '',
        pageTitle: 'Page Not Found',
        isAuthenticated:req.session.isLoggedIn,
    });
}

export function get500(req, res, next) {
    res.status(404).render('500', {
        path: '',
        pageTitle: 'Error',
        isAuthenticated:req.session.isLoggedIn,
    });
}