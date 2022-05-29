// import external modules
import { combineReducers } from "redux";
import application from '../application/reducer'
import swap from "../swap/reducer"
import network from '../network/reducer'
import lux from '../Lux/reducer'
const rootReducer = combineReducers({
  application,
  swap,
  network,
  lux
});

export default rootReducer;
