
exports.register = (req, res) => {
    res.render('register', {
        title: 'Pustak-Panna',
        pageStyles: 'register.css',
        headerStyle: ''
    });
}