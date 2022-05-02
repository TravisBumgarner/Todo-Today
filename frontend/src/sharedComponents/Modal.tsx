import React from 'react'
import styled from 'styled-components'
import ReactModal from 'styled-react-modal'

import { Heading, Icon } from '.'

type ModalProps = {
    children: JSX.Element | JSX.Element[]
    showModal: boolean
    closeModal: () => void
    contentLabel: string
}

const HeaderWrapper = styled.div`
    display: flex;
    margin: 0.5rem;
    justify-content: space-between;
    svg {
        cursor: pointer;
        fill: ${({theme}) => theme.FOREGROUND_TEXT };
        position: relative;
        right: -13px;
        top: -14px;

    &:hover {
        fill: ${({theme}) => theme.FOREGROUND_TEXT };
        }
    }
    `

const ModalWrapper = styled.div`
`

const Modal = ({
    children, showModal, closeModal, contentLabel
}: ModalProps) => {
    return <ReactModal
        isOpen={showModal}
        onBackgroundClick={closeModal}
    >
        <ModalWrapper>
            <HeaderWrapper>
                <Heading.H1>{contentLabel}</Heading.H1>
                <Icon name="close" onClick={closeModal} />
            </HeaderWrapper>
            {children}
        </ModalWrapper>
    </ReactModal>
}

export default Modal
