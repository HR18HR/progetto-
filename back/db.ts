import mongoose from 'mongoose';
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // evita duplicati
    trim: true
  },
  salt:{
     type: String,
    required: true
  },
  digest: {
    type: String,
    required: true
  },
  citta: {
    type: String,
    required: false
  }
});






const User = mongoose.model('User', userSchema);




export default User;
