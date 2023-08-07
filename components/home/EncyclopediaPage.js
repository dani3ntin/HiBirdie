import { View, Text, StyleSheet, ScrollView, ActivityIndicator} from "react-native"
import { useIsFocused } from '@react-navigation/native';
import BirdItemEncyclopedia from "../items/BirdItemEncyclopedia"
import BirdDetailPage from "../detailBird/BirdDetailPage";
import { useState } from "react"
import { useEffect } from "react"

function EncyclopediaPage(props) {
    const isFocused = useIsFocused()
    const [detailBirdmodalIsVisible, setDetailBirdModalIsVisible] = useState(false)
    const [birdIdForDetailBirdModal, setBirdIdForDetailBirdModal] = useState(-1)
    const [birdsData, setBirdsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)

    useEffect(() => {
        if(isFocused){
            fetchData()
        } 
    }, [isFocused])

    const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.1.249:8000/api/getbirdsbyuser/a')
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
                <BirdDetailPage visible={detailBirdmodalIsVisible} id={birdIdForDetailBirdModal} closeModal={closeDetailBirdModal} />
                <ScrollView style={styles.container}>
                    <View style={styles.ItemsContainer}>
                        {birdsData.map((item) => (
                        <View key={item.id}>
                            <BirdItemEncyclopedia id={item.id} name={item.name} image={{ uri: 'http://192.168.1.249:8000/api/getbird/' + item.id }} sightingDate={item.sightingDate} onBirdPressed={openDetailBirdModal}/>
                        </View>
                        ))}
                    </View>
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
})