import { Server } from 'socket.io';
import { MyJwtPayload } from '../types';
import Message from '../db/models/Message';

const baseRoom = 'the only room';

export default (io: Server): void => {
  io.on('connection', (socket): void => {
    const user: MyJwtPayload = (socket as any).user;
    console.log('NEW CONNECTION');
    socket.join(baseRoom);

    socket.on(
      'sendMessage',
      async (message: { message: string; username: string }) => {
        const messageDB = await new Message({
          from: message.username,
          body: message.message,
        }).save();

        io.to(baseRoom).emit('message', messageDB);
      }
    );
  });
};
