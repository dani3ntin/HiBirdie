import { View, Text, StyleSheet, ScrollView, ActivityIndicator} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import BirdItemLatestSightings from "../items/BirdItemLatestSightings"
import BirdDetailPageWithoutAuthor from "../detailBird/BirdDetailPageWithoutAuthor"
import { useState } from "react"
import { useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../../env"

function UserEncyclopedia(props) {
    const isFocused = useIsFocused()
    const [detailBirdmodalIsVisible, setDetailBirdModalIsVisible] = useState(false)
    const [birdIdForDetailBirdModal, setBirdIdForDetailBirdModal] = useState(-1)
    const [birdsData, setBirdsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [latUser, setLatUser] = useState(0)
    const [lonUser, setLonUser] = useState(0)

    useEffect(() => {
        if(isFocused){
            fetchData()
            settingUserCoordinates()
        } 
    }, [isFocused, props.username])

    async function settingUserCoordinates(){
        const storedCoordinatesUserData = await AsyncStorage.getItem('userCoordinates')
        if (storedCoordinatesUserData) {
          const parsedUserData = JSON.parse(storedCoordinatesUserData)
          setLatUser(parsedUserData.latitude)
          setLonUser(parsedUserData.longitude)
        }
    }

    const fetchData = async () => {
        const data = { requestingUser: props.username, latUser: latUser, lonUser: lonUser, authorUsername: props.usernameFollowed }
        try {
            console.log(data)
            const response = await fetch(API_URL + 'getbirdsbyusernamewithdistance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
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

    function addLikeHandler(){
        props.addLikeToCounter()
    }

    function removeLikeHandler(){
        props.removeLikeToCounter()
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
                    originPage={"UserDetail"} 
                    closeModal={closeDetailBirdModal} 
                    loggedUsername={props.username}
                    addLike={addLikeHandler}
                    removeLike={removeLikeHandler}
                />
                <Text style={styles.title}>{props.name}'s Encyclopedia:</Text>
                    {
                        birdsData.length === 0 ?
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>No birds here!</Text>
                            <Text style={styles.text}>{props.name} hasn't added any birds yet</Text>
                        </View>
                        :
                        <View style={styles.ItemsContainer}>
                        {birdsData.map((item) => (
                            <View key={item.id}>
                                <BirdItemLatestSightings 
                                    id={item.id} 
                                    name={item.name} 
                                    image={{ uri: API_URL + 'getbird/' + item.id + '/' + props.username }} 
                                    sightingDate={item.sightingDate} 
                                    likes={item.likes} 
                                    distance={Math.round(item.distance)}
                                    userPutLike={item.userPutLike} 
                                    loggedUsername={props.username}
                                    onBirdPressed={openDetailBirdModal}
                                    addLike={addLikeHandler}
                                    removeLike={removeLikeHandler}
                                />
                            </View>
                        ))}
                        </View>
                    }
            </>
        }
        </>
    )
}

export default UserEncyclopedia

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
    title: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
})