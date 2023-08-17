import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {

  const [globalVariable, setGlobalVariable] = useState({backgroundColor: '#adb2fc', headerColor: '#c0daf8', buttonColor: '#bcc9ff'})

  useEffect(() => {
    getApplicationColor()
  }, [])
  
  async function getApplicationColor(){
    const applicationColor = await AsyncStorage.getItem('applicationColor')
    const parsedColor = JSON.parse(applicationColor)
    if(applicationColor !== null){
      setGlobalVariable({backgroundColor: parsedColor.backgroundColor, headerColor: parsedColor.headerColor, buttonColor: parsedColor.buttonColor})
      console.log(parsedColor)
    }
  }


  return (
    <GlobalContext.Provider value={{ globalVariable, setGlobalVariable }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
