import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import { generateProof, verifyProof } from '@semaphore-noir/proof';
import { ethers } from 'ethers';

const externalNullifier = ethers.encodeBytes32String('Topic');
const signal = ethers.encodeBytes32String('Hello world');

class Semaphore {
  private group: Group;

  constructor(groopTreeDepth: number) {
    this.group = new Group(1, groopTreeDepth);
  }

  getIdentity(id: string) {
    return new Identity(id);
  }

  addMember(id: string) {
    const identity = new Identity(id);
    this.group.addMember(identity.getCommitment());
  }

  async getProof(identity: Identity) {
    const proof = await generateProof(
      identity,
      this.group,
      externalNullifier,
      signal
    );
    return proof;
  }

  async checkProof(proof: any) {
    const check = await verifyProof(proof, this.group.depth);
    return check;
  }
}
export const semaphoreInstance = new Semaphore(3);
Object.freeze(semaphoreInstance);
