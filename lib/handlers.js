/**
 * Request Handlers
 */

// Dependencies
const _data = require('../lib/data');
const helpers = require('./helpers');

// Define handlers
const handlers = {};

// Users handler
handlers.users = (data, callback) => {
  const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
  
  if(acceptableMethods.includes(data.method))
    handlers._users[data.method](data, callback);
  else
    callback(405); //405: METHOD NOT ALLOWED
};

// Container for users submethods
handlers._users = {};

// Users - POST
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.POST = (data, callback) => {
  let {firstName, lastName, phone, password, tosAgreement} = data.payload;

  // Check that all required fields are filled out
  firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 
    ? firstName.trim() 
    : false;

  lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 
    ? lastName.trim() 
    : false;

  phone = typeof(phone) === 'string' && phone.trim().length === 10 
    ? phone.trim() 
    : false;

  password = typeof(password) === 'string' && password.trim().length > 0 
    ? password.trim() 
    : false;

  tosAgreement = typeof(tosAgreement) === 'boolean' && tosAgreement;


  if(firstName && lastName && phone && password && tosAgreement){
    _data.read('users', phone, (err, data) => {
      // Make sure user doesn't already exist
      if(err){
        // Hash the password
        const hashedPasword = helpers.hash(password);

        if(hashedPasword){
          // Create user object
          const userObject = {
            firstName, lastName, phone, hashedPasword, tosAgreement
          }

          // Store user
          _data.create('users', phone, userObject, err => {
            if(!err)
              callback(200, {Success: 'Created new user object'});
            else{
              console.log(err);
              callback(500, {Error: 'Could not create new user'});
            }
          })
        } else 
          callback(500, {Error: 'Could not hash user\'s password'});

      } else
        callback(400, {Error: "A user with that phone number already exists"} )
    })
  } else
    callback(400, {Error: 'Missing required fields'});
}

// Users - GET
handlers._users.GET = (data, callback) => {
  
}

// Users - PUT
handlers._users.PUT = (data, callback) => {
  
}

// Users - DELETE
handlers._users.DELETE = (data, callback) => {
  
}


// Ping handler
handlers.ping = (data, callback) => {
  callback(200)
}

// 404 not found handler
handlers.notFound = (data, callback) => {
  callback(404);
}

// Export
module.exports = handlers;