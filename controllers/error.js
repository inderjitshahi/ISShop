

export function get404(req, res, next) {
    res.status(404).render('404', {
        path: '',
        pageTitle: 'Page Not Found'
    });
}