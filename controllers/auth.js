import User from  '../models/user.js';

export function getLogin(req, res, next) {
    // const isLoggedIn=req.get('Cookie').split('=')[1]==='true';
    // console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
    });
}

export function getSignup (req, res, next){
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
  };

  export function postLogin  (req, res, next){
    User.findById('629be0cb94afdb958b5cd569')
      .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      })
      .catch(err => console.log(err));
  };

  export function postSignup (req, res, next){};

export function postLogout(req, res, next) {
    // res.isLoggedIn=true;   //this data will die as soon  as another res is init
    // res.setHeader('Set-Cookie', 'loggedIn=true');
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    });
}

