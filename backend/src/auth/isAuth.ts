import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MyJwtPayload } from '../types';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated!' });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as MyJwtPayload;
    const user = { hashedTwitterId: decoded.hashedTwitterId, _id: decoded._id };
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Token!' });
  }
};

export default isAuth;
