import React, { useState, useEffect } from "react";
import downloadTextFileIcon from '../../assets/download-text-file.svg';
import copyToClipboardIcon from '../../assets/copy-to-clipboard.svg';
import styles from './GetProofModal.module.css';

const GetProofModal = ({ isOpen, onClose }) => {
    const [showModal, setShowModal] = useState(false);

    const handleCopyToClipboard = () => {
    };

    const handleDownloadTextFile = () => {

    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className={`bg-white rounded-lg p-4 border border-gray-300 ${styles.modal}`}>
                    <div className={styles.header}>
                        <h2 className="text-xl font-semibold">Get Proof</h2>
                        <button
                            className="close-button text-red-500 hover:text-red-700"
                            onClick={onClose}
                            style={{ fontSize: '30px', cursor: 'pointer' }}
                        >
                            &times;
                        </button>
                    </div>
                    <div className={styles.buttonContainer}>
                        {/* <button className={styles.icon} onClick={handleCopyToClipboard}>
                            <img src={copyToClipboardIcon} alt="Copy to Clipboard" />
                            <span>Copy</span>
                        </button> */}
                        <button className={styles.icon} onClick={handleDownloadTextFile}>
                            <img src={downloadTextFileIcon} alt="Download Text File" />
                            <span>Download</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    );


};


export default GetProofModal;