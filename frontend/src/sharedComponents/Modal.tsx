import React from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'

import colors from './colors'
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
        fill: ${colors.FOREGROUND_PRIMARY};
        position: relative;
        right: -13px;
        top: -14px;

    &:hover {
        fill: ${colors.FOREGROUND_PRIMARY};
        }
    }
    `

const ModalWrapper = styled.div`
`

const Modal = ({
    children, showModal, closeModal, contentLabel,
}: ModalProps) => (
    <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel={contentLabel}
        style={{
            overlay: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.BACKGROUND_PRIMARY
            },
            content: {
                borderColor: colors.FOREGROUND_PRIMARY,
                borderRadius: '1.5em',
                backgroundColor: colors.BACKGROUND_PRIMARY,
                position: 'static',
                maxWidth: '80vw'
            },
        }}
    >
        <ModalWrapper>
            <HeaderWrapper>
                <Heading.H1>{contentLabel}</Heading.H1>
                <Icon name="close" color={colors.FOREGROUND_PRIMARY} onClick={closeModal} />
            </HeaderWrapper>
            {children}
        </ModalWrapper>
    </ReactModal>
)

export default Modal
