import React, { useState, useEffect } from "react";
import downloadTextFileIcon from '../../assets/download-text-file.svg';
import copyToClipboardIcon from '../../assets/copy-to-clipboard.svg';
import styles from './GenerateProofModal.module.css';
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof, verifyProof } from "@semaphore-noir/proof"
import { utils } from "ethers"
import GetProofModal from "../../modals/GetProofModal";
import ActionButton from "../../components/ActionButton";

const GenerateProofModal = ({ isOpen, onClose }) => {
    const [showModal, setShowModal] = useState(false);
    const [Proof, setProof] = useState('no proof yet');
    const [isLoading, setIsLoading] = useState(false);
    const [showGetProofModal, setShowGetProofModal] = useState(false);



    async function generate() {
        setIsLoading(true);

        const externalNullifier = utils.formatBytes32String("Topic")
        const signal = utils.formatBytes32String("Hello world")
        const group = new Group(2, 16) // group Id and treeDepte
        // generate the identity with the hashed username

        const identity = new Identity("hashed-username") // create and reproduce the identity with a String message
        console.log(identity)
        const grouMemberAdded = group.addMember(identity.getCommitment())
        console.log("one", group)
        //console.log("grouMemberAdded", grouMemberAdded)


        const proof = await generateProof(identity, group, externalNullifier, signal)
        console.log(proof)
        console.log("proof proof", proof.proof)
        
        const verified = await verifyProof(proof, 16)


        console.log('verified proof', verified)

        //setProof(proof.proof.proof)

        //setProof(proof.proof)
        setProof(proof)

        setIsLoading(false);
        setShowGetProofModal(true);

    }

    const handleGetProofClose = () => {
        setShowGetProofModal(false);
        onClose();
    };

    return (
        <>

            {isOpen && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className={`bg-white rounded-lg p-4 border border-gray-300 ${styles.modal}`}>
                        <div className={styles.header}>
                            <h2 className="text-xl font-semibold">Generate Proof</h2>
                        </div>
                        <div>
                            <h6 className="text-sm text-red-500">Important: Do not close this page while your proof is generating, otherwise it will be lost.</h6>
                        </div>
                        <div>
                            {isLoading ? (
                                <div>
                                    <span>Generating...</span>
                                    <div className={`${styles.loader}`}></div>
                                </div>
                            ) : (
                                <div className={styles.widerButton}>
                                    <ActionButton
                                        onClick={generate}
                                        disabled={isLoading}
                                    >
                                        <span style={{ padding: '0 10px' }}>Generate Proof</span>
                                    </ActionButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )};
            {showGetProofModal && (
                <GetProofModal isOpen={showGetProofModal} onClose={handleGetProofClose} proof={Proof} />
            )}
        </>

    );


};


export default GenerateProofModal;