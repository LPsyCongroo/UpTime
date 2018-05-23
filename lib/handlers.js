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
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
handlers._users.GET = (data, callback) => {
  // GET requests send data as a query string
  let {phone} = data.queryStringObject;

  // Check phone number is valid
  phone = typeof(phone) === 'string' && phone.trim().length === 10 
    ? phone.trim() 
    : false;

  if(phone){
    // Lookup the user
    _data.read('users', phone, (err, data) => {
      if(!err && data){
        // Remove hashedPassword from user object before sending it!
        delete data.hashedPasword;
        callback(200, data);
      } else
        callback(404);
    });
  } else
    callback(400, {Error: 'Missing required field'})
}

// Users - PUT
// Required data: phone
// Optional data: firstName, lastName, password (at least one)
// @TODO Only let an authenticated user update their own object. DOnt let them update someone elses
handlers._users.PUT = (data, callback) => {
  let {phone, firstName, lastName, password} = data.payload;

  // Check for the required fields
  phone = typeof(phone) === 'string' && phone.trim().length === 10 
    ? phone.trim() 
    : false;

  // Check for optional fields
  firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 
    ? firstName.trim() 
    : false;

  lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 
    ? lastName.trim() 
    : false;

  password = typeof(password) === 'string' && password.trim().length > 0 
    ? password.trim() 
    : false;

  // Error if the phone is invalid
  if(phone){
    // Error if nothing is sent to be updated
    if(firstName || lastName || password){
      // Lookup user
      _data.read('users', phone, (err, userData) => {
        if(!err && userData){
          // Update necessary fields
          if(firstName){
            userData.firstName = firstName;
          }
          if(lastName){
            userData.lastName = lastName;
          }
          if(password){
            userData.password = helpers.hash(password);
          }
          
          // Store new updates
          _data.update('users', phone, userData, err => {
            if(!err){
              callback(200);
            } else {
              console.log(err);
              callback(500, {Error: 'Could not update the user'})
            }
          });
        } else 
          callback(404, {Error: 'The specified user does not exist'}) // 404 or 400 are common for put errors
      });
    } else 
      callback(400, {Error: 'Missing fields to update'})
  } else 
    callback(400, {Error: 'Missing required field'})

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