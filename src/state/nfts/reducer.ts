import { createReducer } from '@reduxjs/toolkit';
import Web3 from 'web3';
import { getTotalNfts, getTotalNftSold, getUserNfts, getContractAddress, getNftDetails, getNftPrice, getNftMaxSupply, getNftsPerMint, getNftTotalSupply } from './action';
export interface NftState {
	totalNfts: number;
	totalNftSold: number;
	userNfts: Array<{
		image: string;
	}>
	contractAddress: string;
	nftPrice: string;
	nftsPerMint: number;
	nftDetails: object
}
export const initialState: NftState = {
	totalNfts: 1111,
	totalNftSold: 0,
	userNfts: [],
	contractAddress: '',
	nftPrice: '0.09',
	nftsPerMint: 20,
	nftDetails: {}
}

export default createReducer(initialState, builder => builder.addCase(getTotalNfts, (state: any, action: any) => {
	state.totalNfts = action.payload;
}).addCase(getTotalNftSold, (state: any, action: any) => {
	state.totalNftSold = action.payload
}).addCase(getUserNfts, (state: any, action: any) => {
	state.userNfts = action.payload;
}).addCase(getContractAddress, (state: any, action: any) => {
	state.contractAddress = action.payload;
}).addCase(getNftPrice, (state: any, action: any) => {
	state.nftPrice = Web3.utils.fromWei(action.payload, 'ether');;
}).addCase(getNftMaxSupply, (state: any, action: any) => {
	state.totalNfts = parseFloat(action.payload);;
}).addCase(getNftsPerMint, (state: any, action: any) => {
	state.nftsPerMint = parseFloat(action.payload)
}).addCase(getNftTotalSupply, (state: any, action: any) => {
	state.totalNftSold = parseFloat(action.payload)
}))



