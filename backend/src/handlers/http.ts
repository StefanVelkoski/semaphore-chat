import crypto from 'crypto';
import { Express, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../db/models/User';
import isAuth from '../auth/isAuth';
import { MyJwtPayload, AuthUser } from '../types';
import Message from '../db/models/Message';
import { Profile } from 'passport-twitter';
import { semaphoreInstance } from '../Semaphore';

const messagesLimit = 30;
const minTwitterFollowers = parseInt(
  process.env.MINIMUM_TWITTER_FOLLOWERS as string
);

export default (app: Express): void => {
  app.get('/', (req: Request, res: Response): void => {
    res.send('Welcome to Express & TypeScript Server');
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    async (req, res) => {
      const twitterUser = req.user as Profile;
      const twitterUserJson: { verified: boolean; followers_count: number } =
        twitterUser._json;

      if (
        !(
          twitterUserJson.verified ||
          twitterUserJson.followers_count > minTwitterFollowers
        )
      ) {
        // uncomment in prod
        //  return res.redirect(
        //    `${process.env.CLIENT_URL}?error=twitter_requirements`
        //  );

        // delete the line below in prod
        return res.status(405).json({
          error:
            'A twitter user must have more than 100 followers or be verified!',
        });
      }

      const hashedTwitterId = crypto
        .createHash('sha256')
        .update(twitterUser.id)
        .digest('hex');
      let user = await User.findOne({ hashedId: hashedTwitterId });

      if (user) {
        return res.redirect(
          `${process.env.CLIENT_URL}?error=already_registered`
        );
      }

      user = await new User({
        hashedId: hashedTwitterId,
      }).save();
      semaphoreInstance.addMember(hashedTwitterId);

      const token = jwt.sign({ hashedTwitterId }, process.env.JWT_SECRET!, {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS as string),
      });
      // uncomment in prod
      // res.set('Authorization', `Bearer ${token}`);
      // res.redirect(`${process.env.CLIENT_URL}/`);

      // delete the line below in prod
      return res.status(200).json(`Bearer ${token}`);
    }
  );
  // TODO DELETE THIS ROUTE, USED ONLY IN DEVELOPMENT
  app.get('/generateToken', (req, res) => {
    const token = jwt.sign(
      {
        hashedTwitterId:
          '1a1911af10e60c10b19e911e1d6a98d084e503477fd7ccf8f881d298834418c3',
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS as string),
      }
    );

    return res.status(200).json(token);
  });

  app.get('/messages', isAuth, async (req, res) => {
    let before = req.query.before as string;

    if (isNaN(Date.parse(before))) {
      before = new Date().toString();
    }

    const messages = await Message.find({
      sentAt: { $lt: new Date(before) },
    })
      .sort({ sentAt: -1 })
      .limit(messagesLimit);

    res.status(200).json(messages);
  });

  app.get('/generateProof', isAuth, async (req, res) => {
    const user = req.user as AuthUser;
    const hashedTwitterId = user.hashedTwitterId;
    if (!hashedTwitterId) {
      return res.status(403).json({ error: 'Not allowed!' });
    }
    const proof = await semaphoreInstance.getProof(hashedTwitterId);

    return res.status(200).json(proof);
  });

  app.post('/verifyProof', async (req, res) => {
    const proof = req.body?.proof;

    const isValidProof = await semaphoreInstance.checkProof(proof);

    if (isValidProof) {
      const token = jwt.sign({}, process.env.JWT_SECRET!, {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS as string),
      });
      return res.status(200).json(token);
    } else {
      return res.status(401).json({ status: 'Invalid proof!' });
    }
  });


  app.get('/getGroupInfo', isAuth, async (req, res) => {

  });
};
