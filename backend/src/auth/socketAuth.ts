import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { MyJwtPayload } from '../types';

export default (io: Server) => {
  io.use((socket, next) => {
    //console.log(socket.id);
    // Extract the JWT from the query parameters of the WebSocket connection
    //const authHeader = socket.handshake.query?.token as string | undefined;
    //console.log(`Headers auth: ${authHeader}`);
    //const token = authHeader?.split(' ')[1];
    const token = socket.handshake.query?.token as string;
    return next();
  //   console.log(`Extracted token: ${token}`);
  //   if (!token) {
  //     console.log(`Unauthorized: No token provided`);
  //     return next(new Error('Unauthorized!'));
  //   }

  //   // Verify the JWT
  //   try {
  //     console.log(token)
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  //     console.log(`Token verified successfully for socket ID: ${socket.id}`);
  //     console.log('Hashed Twitter ID:', decoded);
  //     return next();
  //   } catch (error) {
  //     console.log(`Invalid token for socket ID: ${socket.id}:`, error);
  //     console.log('Secret used for verification:', process.env.JWT_SECRET)
  //     next(new Error('Invalid token'));
  //   }
   });
};
