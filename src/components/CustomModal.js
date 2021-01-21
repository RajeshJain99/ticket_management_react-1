import { CButton, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react'
import React from 'react'

export default function CustomModal(props) {
    const { modal, setModal, deleteEntry } = props;

    return (
        <CModal
            show={modal}
            onClose={setModal}
        >
            <CModalHeader closeButton>
            </CModalHeader>
            <CModalBody>
                Are you sure you want to delete this record
                <div className='btn-div-modal-group'>
                    <button onClick={() => deleteEntry()} className='btn btn-primary'>Yes, Approve</button>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton
                    color="secondary"
                    onClick={() => setModal(false)}
                >Cancel</CButton>
            </CModalFooter>
        </CModal>
    )
}
