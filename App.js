import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import HomeHeaderBar from './components/headerBars/HomeHeaderBar';
import Home from './components/home/Home';

export default function App() {

  const user = {
    name: 'Cato esperto', // Inserisci il nome dell'utente qui
    avatar: require('./assets/images/personPic/cat.jpg'), // Inserisci il percorso dell'immagine dell'utente qui
  };

  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.headerContainer}>
        <HomeHeaderBar userName={user.name} userAvatar={user.avatar}/>
      </View>
      <Home/>
      <StatusBar style="auto"/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
  headerContainer: {
    height: '8%'
  }
});
