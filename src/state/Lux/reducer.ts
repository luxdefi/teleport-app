import { createReducer } from '@reduxjs/toolkit';
import Web3 from 'web3';
import { getLuxBalance } from './action';
export interface NftState {
    luxBalance: number;

}
export const initialState: NftState = {
    luxBalance: 0,

}

export default createReducer(initialState, builder => builder.addCase(getLuxBalance, (state: any, action: any) => {
    state.luxBalance = action.payload
}))



