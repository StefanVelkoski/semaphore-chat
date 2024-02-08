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
import Group from '../db/models/Group';
import { Identity } from "@semaphore-protocol/identity"
import { verifyProof } from "@semaphore-noir/proof"

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
      // // const twitterUserJson: { verified: boolean; followers_count: number } =
      // //   twitterUser._json;



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

      // user = await new User({
      //   hashedId: hashedTwitterId,
      // }).save();
      // //semaphoreInstance.addMember(hashedTwitterId);

      const token = jwt.sign({ hashedTwitterId }, process.env.JWT_SECRET!, {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS as string),
      });
      // uncomment in prod
      // res.set('Authorization', `Bearer ${token}`);
      // res.redirect(`${process.env.CLIENT_URL}/`);

      // delete the line below in prod
      // return res.status(200).json(`Bearer ${token}`);
      return res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);

    }
  );

  app.post('/addMember', async (req,res) => {
    console.log(req.body)
    const { commitment } = req.body; 

    if (!commitment) {
      return res.status(400).json({ message: 'Commitment is required.' });
  }
  const groupId = 1;
  try {
    let group = await Group.findOne({ Id: groupId });

    if (!group) {
        console.log('Group not found, creating a new one...');
        group = new Group({
            Id: groupId,
            treeDepth: 16, 
            members: []
        });
        await group.save();
    }

    if (group.members.includes(commitment)) {
        return res.status(409).json({ message: 'Member already exists in the group.' });
    }

    group.members.push(commitment);
    await group.save();

    res.status(201).json({ message: 'Member successfully added to the group.', group });
} catch (error) {
    console.error('Error adding member to group:', error);
    res.status(500).json({ message: 'Failed to add member to the group.', error });
}
  });

  app.post('/register', async (req,res) => {
    const { password } = req.body;

    if (!password || password.length < 4) {
      return res.status(400).json({ message: 'Password is required and must be at least 8 characters long.' });
  }


    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    try {
      const commitment = semaphoreInstance.addMember(hashedPassword);

      let group = await Group.findOne({ Id: 1 });
      if (!group) {
          group = new Group({
              Id: 1,
              treeDepth: 16,
              members: [],
          });
      }

      if (!group.members.includes(commitment)) {
          group.members.push(commitment);
          await group.save();
          res.status(201).json({ message: 'User successfully added to the group.' });
      } else {
          res.status(409).json({ message: 'This member is already part of the group.' });
      }
    } catch (error) {
      console.error('Error in registration:', error);
      res.status(500).json({ error: 'Registration failed.' });
  }
    
  });

  app.get('/generateToken', (req, res) => {

    //if the verification is true grant the user a token to be able to access the app
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

  app.get('/messages', async (req, res) => {
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

  app.get('/group', async (req, res) => {
    try {
        const group = await Group.findOne({ Id: 1 }); 
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group); 
    } catch (error) {
        console.error('Failed to retrieve group:', error);
        res.status(500).json({ message: 'Failed to retrieve group information' });
    }
});

app.post('/login', async (req, res) => {
  console.log('calling login')
  const { fullProof } = req.body;
  //console.log('Received fullProof:', fullProof);

  const proofObject = JSON.parse(fullProof);

  if (Array.isArray(proofObject.proof.publicInputs)) {
      proofObject.proof.publicInputs = new Map(proofObject.proof.publicInputs);
  }

  if (typeof proofObject.proof.proof === 'object' && !Array.isArray(proofObject.proof.proof)) {
      proofObject.proof.proof = Object.values(proofObject.proof.proof);
  }
  try {
    console.log('Verifying proof...'); 
      const isValid = await verifyProof(proofObject, 16); 

      if (isValid) {
        console.log('Proof verified successfully.');
          res.json({ message: 'Proof verified successfully' });
      } else {
        console.log('Invalid proof.'); 
          res.status(400).json({ message: 'Invalid proof' });
      }
  } catch (error) {
      console.error('Proof verification failed:', error);
      res.status(500).json({ message: 'Error verifying proof' });
  }
});
  // app.get('/generateProof', isAuth, async (req, res) => {
  //   const user = req.user as AuthUser;
  //   const hashedTwitterId = user.hashedTwitterId;
  //   if (!hashedTwitterId) {
  //     return res.status(403).json({ error: 'Not allowed!' });
  //   }
  //   const proof = await semaphoreInstance.getProof(hashedTwitterId);

  //   return res.status(200).json(proof);
  // });

  // app.post('/verifyProof', async (req, res) => {
  //   const proof = req.body?.proof;

  //   const isValidProof = await semaphoreInstance.checkProof(proof);

  //   if (isValidProof) {
  //     const token = jwt.sign({}, process.env.JWT_SECRET!, {
  //       expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS as string),
  //     });
  //     return res.status(200).json(token);
  //   } else {
  //     return res.status(401).json({ status: 'Invalid proof!' });
  //   }
  // });

  //
  app.get('/getGroup/:id', async (req, res) => {
    const groupId = req.params.id;

    try {
      // Find the group by ID
      const group = await Group.findOne({ Id: groupId });

      if (group) {
        return res.status(200).json({ group });
      } else {
        return res.status(404).json({ message: 'Group not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  
};
