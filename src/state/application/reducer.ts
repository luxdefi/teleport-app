import { createReducer } from '@reduxjs/toolkit'
import { ApplicationModal, setOpenModal, setPriorityConnector } from './actions'

export interface ApplicationState {
  readonly openModal: ApplicationModal | null
  priorityConnector: any
}

const initialState: ApplicationState = {

  openModal: null,
  priorityConnector: null
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
    }).addCase(setPriorityConnector, (state, action) => {
      state.priorityConnector = action.payload
    })

)
