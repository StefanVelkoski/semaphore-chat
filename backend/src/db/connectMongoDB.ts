import mongoose from 'mongoose';

export default function (): void {
  mongoose
    .connect(process.env.MONGO_URI || '')
    .then((): void => {
      console.log('MongoDB connected successfully!');
    })
    .catch((error: any): void => {
      console.log(`MongoDB connection error: ${error}`);
    });
}
