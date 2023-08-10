import { View, Text, StyleSheet, ScrollView, ActivityIndicator} from "react-native"
import { useIsFocused } from '@react-navigation/native';
import BirdItemEncyclopedia from "../items/BirdItemEncyclopedia"
import BirdDetailPage from "../detailBird/BirdDetailPage";
import { useState } from "react"
import { useEffect } from "react"
import { changeDateFormatToDDMMYYYY } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EncyclopediaPage() {
    const isFocused = useIsFocused()
    const [username, setUsername] = useState(null)
    const [detailBirdmodalIsVisible, setDetailBirdModalIsVisible] = useState(false)
    const [birdIdForDetailBirdModal, setBirdIdForDetailBirdModal] = useState(-1)
    const [birdsData, setBirdsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)

    useEffect(() => {
        if(isFocused){
            settingUsername()
            fetchData()
        } 
    }, [isFocused, username])

    async function settingUsername(){
        const storedUserData = await AsyncStorage.getItem('userData')
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData)
          setUsername(parsedUserData.username)
        }
    }

    const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.1.249:8000/api/getbirdsbyuser/' + username + '/' + username)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const jsonData = await response.json()
      
          setBirdsData(jsonData)
          setIsLoadingItems(false)
          
        } catch (error) {
          console.error('Error on getting the datas:', error)
          setIsLoadingItems(false)
        }
    }

    function closeDetailBirdModal(){
        setDetailBirdModalIsVisible(false)
    }

    function openDetailBirdModal(id){
        setBirdIdForDetailBirdModal(id)
        setDetailBirdModalIsVisible(true)
    }

    return (
        <>
        {
            isLoadingItems ?
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"  color="#0000ff"/>
            </View>
            :
            <>
                <BirdDetailPage 
                    visible={detailBirdmodalIsVisible} 
                    id={birdIdForDetailBirdModal} 
                    originPage={"Encyclopedia"} 
                    closeModal={closeDetailBirdModal} 
                    loggedUsername={username}
                />
                <ScrollView style={styles.container}>
                    {
                        birdsData.length === 0 ?
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>No birds here!</Text>
                            <Text style={styles.text}>Try adding one with the "new bird" button below, it's easy!</Text>
                        </View>
                        :
                        <View style={styles.ItemsContainer}>
                        {birdsData.map((item) => (
                            <View key={item.id}>
                                <BirdItemEncyclopedia id={item.id} name={item.name} image={{ uri: 'http://192.168.1.249:8000/api/getbird/' + item.id + '/' + username }} sightingDate={changeDateFormatToDDMMYYYY(item.sightingDate)} onBirdPressed={openDetailBirdModal}/>
                            </View>
                        ))}
                        </View>
                    }
            </ScrollView>
            </>
        }
        </>
    )
}

export default EncyclopediaPage

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    android: {
        elevation: 8,
    },
    default: {},
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e9e7e7',
    },
    ItemsContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        ...shadowStyle
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingLeft: 30,
        paddingRight: 30,
    },
    text: {
        fontSize: 18,
    }
})