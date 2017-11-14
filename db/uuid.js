"use strict";

module.exports = () => {
  // From https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  let val = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
  return val
};
