const mongoose = require('mongoose');
module.exports = async function(){
try{
await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true});
console.log('MongoDB connected');
}catch(e){
console.error(e);
process.exit(1);
}
}