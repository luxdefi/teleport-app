import { createAction } from '@reduxjs/toolkit';

export const getTotalNfts = createAction<any>('nfts/getTotalNfts');

export const getTotalNftSold = createAction<any>('varialbes/getTotalNftSold');

export const getUserNfts = createAction<any>('nfts/getUserNfts');

export const getContractAddress = createAction<any>('nfts/getContractAddress');
export const getNftDetails = createAction<object>('nfts/getNftDetails')
export const getNftPrice = createAction<string>('nfts/getNftPrice')
export const getNftMaxSupply = createAction<string>('nfts/getNftMaxSupply')
export const getNftsPerMint = createAction<string>('nfts/getNftsPerMint')
export const getNftTotalSupply = createAction<string>('nfts/getNftTotalSupply')

