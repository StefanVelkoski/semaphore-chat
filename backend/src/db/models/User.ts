import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  hashedId: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model('user', UserSchema);

export default User;
