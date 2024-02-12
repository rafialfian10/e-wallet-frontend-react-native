import { createContext, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

const initialState = { 
  isLogin: false,
  user: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "USER_SUCCESS":
    case "LOGIN_SUCCESS":
      return {
        isLogin: true,
        user: payload,
      };
    case "AUTH_ERROR":
    case "LOGOUT":
      return {
        isLogin: false,
        user: {},
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

// status auth
export const loginSuccess = payload => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: payload,
  };
};

export const authSuccess = payload => {
  return {
    type: 'AUTH_SUCCESS',
    payload: payload,
  };
};

export const authError = () => {
  return {
    type: 'AUTH_ERROR',
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};


// token
const storeToken = async value => {
  try {
    await AsyncStorage.setItem('token', value);
  } catch (e) {
    // saving error
  }
  console.log('Store Token Done.');
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (e) {
    // remove error
  }
  console.log('Remove Token Done.');
};




