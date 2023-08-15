import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import BirdItemEncyclopedia from "../items/BirdItemEncyclopedia"
import BirdDetailPageWithoutAuthor from "../detailBird/BirdDetailPageWithoutAuthor"
import AddNewBird from "../addNewBird-editBird/AddNewBird"
import { useState } from "react"
import { useEffect } from "react"
import { changeDateFormatToDDMMYYYY } from "../utils/utils"
import { API_URL } from "../../env"

function EncyclopediaPage(props) {
    const isFocused = useIsFocused()
    const [detailBirdmodalIsVisible, setDetailBirdModalIsVisible] = useState(false)
    const [addNewBirdmodalIsVisible, setAddNewBirdModalIsVisible] = useState(false)
    const [birdIdForDetailBirdModal, setBirdIdForDetailBirdModal] = useState(-1)
    const [birdsData, setBirdsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)

    useEffect(() => {
        if(isFocused){
            fetchData()
        } 
    }, [isFocused, props.username])

    const fetchData = async () => {
        try {
          const response = await fetch(API_URL + 'getbirdsbyuser/' + props.username + '/' + props.username)
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
        fetchData()
        setIsLoadingItems(true)
    }

    function openDetailBirdModal(id){
        setBirdIdForDetailBirdModal(id)
        setDetailBirdModalIsVisible(true)
    }

    function closeAddNewBirdModal(){
        setAddNewBirdModalIsVisible(false)
        fetchData()
        setIsLoadingItems(true)
    }

    function openAddNewBirdModal(){
        setAddNewBirdModalIsVisible(true)
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
                <BirdDetailPageWithoutAuthor 
                    visible={detailBirdmodalIsVisible} 
                    id={birdIdForDetailBirdModal} 
                    originPage={"Encyclopedia"} 
                    closeModal={closeDetailBirdModal} 
                    loggedUsername={props.username}
                />
                <AddNewBird 
                    visible={addNewBirdmodalIsVisible}
                    closeModal={closeAddNewBirdModal} 
                    loggedUsername={props.username}
                />
                <ScrollView style={styles.container}>
                    {
                        birdsData.length === 0 ?
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>No birds here!</Text>
                            <Text style={styles.text}>Try adding one with the "Add new bird" button below, it's easy!</Text>
                        </View>
                        :
                        <View style={styles.ItemsContainer}>
                        {birdsData.map((item) => (
                            <View key={item.id}>
                                <BirdItemEncyclopedia 
                                id={item.id} 
                                name={item.name} 
                                image={{ uri: API_URL + 'getbird/' + item.id + '/' + props.username }} 
                                sightingDate={changeDateFormatToDDMMYYYY(item.sightingDate)} 
                                onBirdPressed={openDetailBirdModal}/>
                            </View>
                        ))}
                        </View>
                    }
                </ScrollView>
                <Pressable 
                    style={({ pressed }) => [
                        styles.floatingButton,
                        pressed && { opacity: 0.8, backgroundColor: '#929292' }
                    ]} 
                    onPress={openAddNewBirdModal} 
                    >
                    <Text style={styles.buttonText}>Add new bird</Text>
                </Pressable>
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
    },
    floatingButton: {
        position: 'absolute',
        bottom: 40,
        width: 200,
        height: 70,
        borderWidth: 2,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 3,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
})