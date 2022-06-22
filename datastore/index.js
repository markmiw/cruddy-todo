const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    let dir = exports.dataDir + '/' + id + '.txt';
    fs.writeFile(dir, text, (err) => {
      if (err) {
        console.error('error');
        callback('ERROR');
      } else {
        callback(err, {text: text, id: id});
      }
    });
    // test = counter;
    // items[id] = text;
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) { console.log(err); } else {
      let result = [];
      for (let i = 0; i < files.length; i ++) {
        let id = files[i].substring(0, files[i].length - 4);
        result.push({id: id, text: id});
      }
      callback(null, result);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if ((!files.includes((id) + '.txt'))) {
      callback("FILE DOESN'T EXIST", files);
    } else {
      let dir = exports.dataDir + '/' + id + '.txt';
      fs.writeFile(dir, text, (err) => {
        if (err) {
          console.error('error');
          callback('ERROR');
        } else {
          callback(err, {text: text, id: id});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let dir = exports.dataDir + '/' + id + '.txt';
  fs.unlink(dir, (err, id) => {
    if (err) {
      console.error('error');
      callback(err);
    } else {
      callback('SUCCESSFULLY DELETED');
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
