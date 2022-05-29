import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
    CONNECT, WALLET, MINT, SIDEBAR
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const setPriorityConnector = createAction<any>('application/setPriorityConnector')