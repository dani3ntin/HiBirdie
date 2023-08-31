import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {

  const [globalVariable, setGlobalVariable] = useState({
    backgroundColor: '#deeeff', 
    headerColor: '#b8bdff',
    buttonColor: '#bcc9ff', 
    API_URL: 'https://www.hibirdie.it/api/', 
    randomStringToUpdate: '?' + (Math.random() * 100),
  })

  useEffect(() => {
    initializeGlobalVariable()
  }, [])
  
  async function initializeGlobalVariable(){
    const applicationColor = await AsyncStorage.getItem('applicationColor')
    const parsedColor = JSON.parse(applicationColor)
    if(applicationColor !== null){
      setGlobalVariable({
        backgroundColor: parsedColor.backgroundColor, 
        headerColor: parsedColor.headerColor, 
        buttonColor: parsedColor.buttonColor, 
        API_URL: 'https://www.hibirdie.it/api/', 
        randomStringToUpdate: '?' + (Math.random() * 100),
      })
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
