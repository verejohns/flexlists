import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import userReducer from './userReducer';
import viewReducer from './viewReducer';
import listReducer from './listReducer';
import adminReducer from './adminReducer';
import groupReducer from './groupReducer';
import authReducer from './authReducer';
import supportReducer from './supportReducer';
import applicationReducer from './applicationReducer';
import widgetReducer from './widgetReducer';

const rootReducer = combineReducers({
  message: messageReducer,
  user: userReducer,
  view: viewReducer,
  list: listReducer,
  admin: adminReducer,
  group: groupReducer,
  auth: authReducer,
  support: supportReducer,
  application: applicationReducer,
  widget: widgetReducer
});

export default rootReducer;