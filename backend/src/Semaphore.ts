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
    const commitment = identity.getCommitment();
    this.group.addMember(commitment);
    console.log(`Added member with ID: ${id}`);
    this.logState();
    return commitment;
  }

  async getProof(id: string) {
    const identity = this.getIdentity(id);
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

  logState() {
    console.log(`Group ID: ${this.group.id}, Tree Depth: ${this.group.depth}`);
  }
}
export const semaphoreInstance = new Semaphore(16);
Object.freeze(semaphoreInstance);
