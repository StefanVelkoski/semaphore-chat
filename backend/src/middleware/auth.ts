// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from 'express';

// const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ error: 'Not authenticated!' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     const user = decoded.user;
//     req.user = user;
//     return next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid Token!' });
//   }
// };

// export default {
//     isAuthenticated
// }
