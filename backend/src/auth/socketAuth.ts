import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { MyJwtPayload } from '../types';

export default (io: Server) => {
  io.use((socket, next) => {
    console.log(socket.id);
    // Extract the JWT from the query parameters of the WebSocket connection
    const authHeader = socket.handshake.query?.token as string | undefined;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return next(new Error('Unauthorized!'));
    }

    // Verify the JWT
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as MyJwtPayload;
      const user = {
        hashedTwitterId: decoded.hashedTwitterId,
        _id: decoded._id,
      };
      (socket as any).user = user;
      return next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });
};
