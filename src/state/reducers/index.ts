// import external modules
import { combineReducers } from "redux";
import application from '../application/reducer'
import nfts from "../nfts/reducer"
const rootReducer = combineReducers({
  application,
  nfts
});

export default rootReducer;
