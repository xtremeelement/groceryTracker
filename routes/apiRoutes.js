// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

// eslint-disable-next-line func-names
module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/createUser", (req, res) => {
    db.Users.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Route for getting all products
  app.get("/api/all", (req, res) => {
    db.Products.findAll({}).then((dbProducts) => {
      res.json(dbProducts);
    });
  });

  // Route for getting all products by a specific category
  app.get("/api/products/:category", (req, res) => {
    db.Products.findAll({
      where: {
        category: req.params.category
      }
    }).then((dbProducts) => {
      res.json(dbProducts);
    });
  });

  // Route for getting a product by ID
  app.get("/api/products/:id", (req, res) => {
    db.Products.findOne({
      where: {
        id: req.params.id
      }
    }).then((dbProducts) => {
      res.json(dbProducts);
    });
  });

  // Route for getting a product by name
  app.get("/api/products/:name", (req, res) => {
    db.Products.findAll({
      where: {
        product_name: req.params.name
      }
    }).then((dbProducts) => {
      res.json(dbProducts);
    });
  });
};
