const mongoose = require("mongoose");

module.exports = async () => {
  return mongoose.connect(
    "mongodb+srv://saketh:saketh143@cluster0.3457v.mongodb.net/?retryWrites=true&w=majority"
  );
};
