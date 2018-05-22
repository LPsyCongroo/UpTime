/**
 * Library for storing and editing data
 */

//  Dependencies
const fs = require('fs');
const path = require('path');

// container for module
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
  // Open file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
      // Convert data to string
      const stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, err => {
        if(!err){
          fs.close(fileDescriptor, err => {
            if(!err){
              callback(false);
            }
            else
              callback('Error closing new file')
          })
        } else
          callback('Error writing to new file')
      })
    } else
      callback('Could not create new file, it may already exist.')
  });
}

// Read data from file 
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
    callback(err, data);
  });
};

// Update existing file
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    
  })
  
}

// Export module
module.exports = lib;