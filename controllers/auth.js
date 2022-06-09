import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();
const API_KEY = process.env.SENDGRID_API_KEY;
// import otp from 'otp-generator';
sgMail.setApiKey(API_KEY);


// console.log(otp.generate(6,{
//   upperCaseAlphabets:false,
//   specialChars:false,
// }));

export function getLogin(req, res, next) {
  // const isLoggedIn=req.get('Cookie').split('=')[1]==='true';
  // console.log(req.session.isLoggedIn);
  let message = req.flash('inputError');
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
    errorMessage: message,
    oldInput:{email:'', password:'',},
    validationErrors: [],
  });
};

export function getReset(req, res, next) {
  let message = req.flash('resetError');
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message,
  });
};


export function getNewPassword(req, res, next) {
  const Token = req.params.token;
  User.findOne({ resetToken: Token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (user) {
        let message = req.flash('resetError');
        if (message.length > 0) {
          message = message;
        } else {
          message = null;
        }
        return res.render('auth/newPassword', {
          pageTitle: 'New Password',
          path: '/newPassword',
          errorMessage: message,
          userId: user._id.toString(),
          token: Token,
        });
      }
    })
    .catch(err => {
      next(new Error(err));
    });

};

export function getSignup(req, res, next) {
  let message = req.flash('signupError');
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message,
    oldInput:{email:'',password:'',confirmPassword:''},
    validationErrors: [],
  });
};

export function postLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(442).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput:{email:email,password:password,},
      validationErrors: errors.array(),
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (user===null) {
          return res.status(442).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isAuthenticated: false,
            errorMessage: "Invalid Email or Password",
            oldInput:{email:email,password:password,},
            validationErrors: [],
          });
      }
      // console.log(user);
      bcrypt.compare(password, user.password)
        .then(mached => {
          if (mached) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              if(err){ console.log(err); }
              res.redirect('/');
            });
          } else {
            return res.status(442).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              isAuthenticated: false,
              errorMessage: 'Invalid Password',
              oldInput:{email:email,password:password,},
              validationErrors: [],
            });
          }
        })
        .catch(err => {
          if(err){
            console.log(err);
          }
          res.redirect('/login');
        })
    })
    .catch(err => {
      next(new Error(err));
    });
};

export function postSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  // console.log(errors.array());
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(442).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password,
        confirmPassword:req.body.confirmPassword
      },
      validationErrors: errors.array(),
    });
  }
  
   bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          })
          return user.save();
    })
    .then(result => {
      return sgMail.send({
        to: email,
        from: "inderjitshahi_mc20a7_13@dtu.ac.in",
        subject: "Welcome To ISShop",
        html: "<h1>Dear Customer, Welcome to ISShop</h1>",
      });
    })
    .then(result => {
      res.redirect('/login');
      console.log("Mail Sent");
    })
    .catch(err => {
      next(new Error(err));
    });
};

export function postLogout(req, res, next) {
  // res.isLoggedIn=true;   //this data will die as soon  as another res is init
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};



export function postReset(req, res, next) {

  crypto.randomBytes(32, (err, buffer) => {
    if (err !== null) {
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('resetError', "No Account Exits with the entered Email");
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        return sgMail.send({
          to: req.body.email,
          from: {
            name: "ISSop",
            email: "inderjitshahi_mc20a7_13@dtu.ac.in"
          },
          subject: "Password Reset",
          html: `
        <p>You Requested A Password Reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new Password</p>
        <p>Note: This link is valide for 5 Minutes Only</p>
        `,
        });
      })
      .then(result => {
        console.log("Mail Sent");
        return res.redirect('/');
      })
      .catch(err => {
        next(new Error(err));
      });
  });
};

export function postNewPassword(req, res, next) {
  const newPassword = req.body.password;
  const token = req.body.token;
  const userId = req.body.userId;
  let resetUser;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
    _id: userId,
  })
    .then(user => {
      if (user) {
        // console.log(user);
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      }
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      console.log('Updated Password');
      return res.redirect('/login');
    })
    .catch(err => {
      next(new Error(err));
    })
}