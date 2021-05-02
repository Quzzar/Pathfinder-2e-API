const router = require('express').Router();

router.get('/oauth2/authorize/:id', (req, res) => {

  

});

router.post('/oauth2/token', (req, res) => {

  

});

///////////////

const authCheck = (req, res, next) => {
  if(req.header('Authorization') != null){
    const apiKey = req.header('Authorization').replace('Apikey ', '');
    ClientAPI.validAPIKey(apiKey).then((isValid) => {
      if(isValid){
        next();
      } else {
        res.sendStatus(400);
      }
    });
  } else {
    res.sendStatus(400);
  }
};

//router.use('/', authCheck, apiGeneralRoutes);

module.exports = router;