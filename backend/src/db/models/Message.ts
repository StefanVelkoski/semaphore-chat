import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'sentAt' } }
);

const Message = mongoose.model('message', messageSchema);

export default Message;
