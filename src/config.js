var DEFAULT_CONFIG = require('./config/default');
var STAGING_CONFIG = require('./config/staging');
var PRODUCTION_CONFIG = require('./config/production');

let config = function(){
    if(process.env.REACT_APP_MODE == 'staging'){
        return STAGING_CONFIG;
    }
    if(process.env.REACT_APP_MODE == 'production'){
        return PRODUCTION_CONFIG;
    }
    else{
        return DEFAULT_CONFIG;
    }
}

export default config();