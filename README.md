# Semaphore Chat App

The Semaphore Chat app is a secure and anonymous chat application built with the @semaphore-noir/proof package, TypeScript, React, Node.js (using Socket.io for live chat), and MongoDB. <br>

The app focuses on providing a private and trustworthy platform for users to engage in meaningful conversations without compromising their identity all with the help of the Semaphore protocol.


## TL;DR


- The app leverages Twitter OAUTH 2.0 for proof of humanity, ensuring users have more than 100 followers or a verified Twitter account.
- Upon a successful verification a semaphore proof is generated for the user.
- The user has to store the proof locally to be able to participate in the chat without doing a new Twitter verification.
- The generated proof can be used as the login credentials which is essentialy the merkle tree verification.
- Once logged in the user can change the username and the avatar to their personal liking.
- If the user loses their keys they will lose their private identity.


## Features


1. **Authentication**
   - Twitter v2-API for frontend verification, ensuring users have more than 100 followers or a verified Twitter account.
   - Backend authentication service powered by *passport-twitter*.

2. **Identity**
   - Upon successful authentication, users receive unique "ZK-keys" as their private identity.
   - Users can store their commitments locally or opt for the app to securely store them in local storage.
     
3. **Anonymity**
   - Access the chat with an anonymous random nickname after login, preserving user privacy.

4. **Security**
   - Loss of keys prevents users from rejoining the chat or creating a new account.
   - The merkle tree root is stored in the database

