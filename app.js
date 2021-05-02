const express = require('express');

const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon');
const path = require('path');

const mainRoutes = require('./routes/main-routes');
const apiRoutes = require('./routes/api-routes');

// Rate Limiter
const rateLimiterFlexible = require('rate-limiter-flexible');
const rateOptions = {
  points: 10, // 10 points
  duration: 1, // Per second
};
const rateLimiter = new rateLimiterFlexible.RateLimiterMemory(rateOptions);

// Setup Express Server
const app = express();

// Set to use Handlebars instead of HTML
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    // Handlebar Helpers:
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    ifEqual: function(a, b, options) {
      if (a == b) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
    },
  }
}));
app.set('view engine', 'handlebars');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

const port = 8000;
app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
});

// Set FavIcon
app.use(favicon('./public/images/favicon.ico'));

// Rate Limiter
app.use(function(req, res, next) {
  rateLimiter.consume(req.ipAddress, 2) // -> consume 2 points
    .then((rateLimiterRes) => { // Points consumed
      return next();
    }).catch((rateLimiterRes) => { // Not enough points to consume
      return res.sendStatus(429);
    });
});

// Routes
app.use('/', mainRoutes);
app.use('/api', apiRoutes);