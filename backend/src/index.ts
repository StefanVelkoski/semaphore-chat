import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import handleHTTP from './handlers/http';
import handleWebSocket from './handlers/webSocket';
import connectMongoDB from './db/connectMongoDB';
import socketAuth from './auth/socketAuth';

dotenv.config();

connectMongoDB();

// ENV
const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = process.env.PORT || 8000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(passport.initialize());
require('../src/auth/passport-twitter');
socketAuth(io);

// Middleware
app.use(express.json());
app.use(cors({ origin: [clientURL, 'http://localhost:5500'] }));
app.use(session({ secret: 'secret' }));

handleHTTP(app);
handleWebSocket(io);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ error: 'Internal Server Error!' });
});

httpServer.listen(port, (): void => {
  console.log(`Server is Live at ${port}`);
});
