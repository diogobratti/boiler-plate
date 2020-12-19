const passport = require('passport');
const database = require("../models");
const tokens = require('./tokens');

module.exports = {
    local: (req, res, next) => {
        passport.authenticate(
            'local', 
            { session: false }, 
            (error, user, info) => {
                if(error && error.name === 'InvalidArgumentError'){
                    return res.status(401).json({ error: error.message });
                }

                if(error){
                    return res.status(500).json({ error: error.message });
                }

                if(!user){
                    return res.status(401).json();
                }

                req.user = user;
                return next();
            }
        )(req, res, next);
    },
    bearer: (req, res, next) => {
        passport.authenticate(
            'bearer', 
            { session: false }, 
            (error, user, info) => {
                if(error && error.name === 'JsonWebTokenError'){
                    return res.status(401).json({ error: error.message });
                }

                if(error && error.name === 'TokenExpiredError'){
                    return res.status(401).json({ error: error.message, expiredAt: error.expiredAt });
                }

                if(error){
                    return res.status(500).json({ error: error.message });
                }

                if(!user){
                    return res.status(401).json();
                }
                req.token = info.token;
                req.user = user;
                return next();
            }
        )(req, res, next);
    },
    async refresh (req, res, next) {
      try {
        const { refreshToken } = req.body;
        const id = await tokens.refresh.verify(refreshToken);
        await tokens.refresh.invalidate(refreshToken);
        req.user = await database.User.findByPk(id);
        return next();
      } catch (error) {
        if (error.name === 'InvalidArgumentError') {
          return res.status(401).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
    },
  
    async emailVerification (req, res, next) {
      try {
        const { token } = req.params;
        const id = await tokens.emailVerification.verify(token);
        const user = await database.User.findByPk(id);
        req.user = user;
        next();
      } catch (error) {
        next(error);
      }
    }
}