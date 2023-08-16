import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {

  const [globalVariable, setGlobalVariable] = useState({backgoundColor: '#e9e7e7', headerColor: '#f2f2f2'})

  useEffect(() => {
    getApplicationColor()
  }, [])
  
  async function getApplicationColor(){
    const applicationColor = await AsyncStorage.getItem('applicationColor')
    const parsedColor = JSON.parse(applicationColor)
    if(applicationColor !== null){
      setGlobalVariable({backgoundColor: parsedColor.backgoundColor, headerColor: parsedColor.headerColor})
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
