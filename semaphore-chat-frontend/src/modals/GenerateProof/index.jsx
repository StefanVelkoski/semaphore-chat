import React, { useState, useEffect } from "react";
import downloadTextFileIcon from '../../assets/download-text-file.svg';
import copyToClipboardIcon from '../../assets/copy-to-clipboard.svg';
import styles from './GenerateProofModal.module.css';
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof, verifyProof } from "@semaphore-noir/proof"
import { utils } from "ethers"




const GenerateProofModal = ({ isOpen, onClose }) => {
    const [showModal, setShowModal] = useState(false);
    const [Proof, setProof] = useState('no proof yet');

    async function generate() {
        const externalNullifier = utils.formatBytes32String("Topic")
        const signal = utils.formatBytes32String("Hello world")
        const group = new Group(2, 16) // group Id and treeDepte
        // generate the identity with the hashed username

        const identity = new Identity("$hashed-username") // create and reproduce the identity with a String message

        const grouMemberAdded = await group.addMember(identity.getCommitment())
        console.log("one", group)

        const proof = await generateProof(identity, grouMemberAdded, externalNullifier, signal)

        const verified = await verifyProof(proof, 16)


        console.log('verified proof', verified)

        setProof(proof.proof.proof)

    }


    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className={`bg-white rounded-lg p-4 border border-gray-300 ${styles.modal}`}>
                    <div className={styles.header}>
                        <h2 className="text-xl font-semibold">Generate Proof</h2>
                        <button
                            className="close-button text-red-500 hover:text-red-700"
                            onClick={onClose}
                            style={{ fontSize: '30px', cursor: 'pointer' }}
                        >
                            &times;
                        </button>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={generate}>GenerateProof</button>
                    </div>
                    <div>{Proof}</div>
                </div>
            </div>
        )
    );


};


export default GenerateProofModal;