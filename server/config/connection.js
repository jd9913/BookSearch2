const mongoose = require('mongoose');



mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/MyLibrary', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
})
.then(()=>console.log("DB Connected"))
.catch(err=>console.error(err));

module.exports = mongoose.connection;
