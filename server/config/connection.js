const mongoose = require('mongoose');



mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/MyLibrary', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
}
).then(()=>console.log("MongoDB Connected"))
.catch(err=>console.error(err));

// console.dir(process.env.MONGO_URI)

module.exports = mongoose.connection;
