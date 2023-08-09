import { View, Button, StyleSheet, ScrollView, ActivityIndicator, Pressable, Text,TouchableOpacity} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import BirdItemLatestSightings from "../items/BirdItemLatestSightings"
import { useEffect, useState } from "react"
import BirdDetailPage from "../detailBird/BirdDetailPage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import FilterLatestSightingsPage from "../filterLatestSightingsPage/FilterLatestSightingsPage"
import { getMaximumDaysRealValueFromKey, getMaximumDistanceRealValueFromKey } from "../filterLatestSightingsPage/MapKeyValueFilter"

function LatestSightingsPage(props) {
    const isFocused = useIsFocused()
    const [username, setUsername] = useState(null)
    const [detailBirdmodalIsVisible, setDetailBirdModalIsVisible] = useState(false)
    const [filtermodalIsVisible, setfilterModalIsVisible] = useState(false)
    const [birdIdForDetailBirdModal, setBirdIdForDetailBirdModal] = useState(-1)
    const [authorUsernameForDetailBirdModal, setAuthorUsernameForDetailBirdModal] = useState('')
    const [birdsData, setBirdsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [filterMaximumDays, setFilterMaximumDays] = useState('')
    const [filterMaximumDistance, setFilterMaximumDistance] = useState('')
    const [latUser, setLatUser] = useState(0)
    const [lonUser, setLonUser] = useState(0)
    const [dataOfLastFilterUpdate, setDataOfLastFilterUpdate] = useState([])

    useEffect(() => {
        if(isFocused){
            settingUserCoordinates()
            settingFilter()
            settingUsername()
            fetchData()
        } 
    }, [isFocused ,username, filterMaximumDays, filterMaximumDistance])

    async function settingUserCoordinates(){
        const storedCoordinatesUserData = await AsyncStorage.getItem('userCoordinates')
        if (storedCoordinatesUserData) {
          const parsedUserData = JSON.parse(storedCoordinatesUserData)
          setLatUser(parsedUserData.latitude)
          setLonUser(parsedUserData.longitude)
        }
    }

    async function settingUsername(){
        const storedUserData = await AsyncStorage.getItem('userData')
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData)
          setUsername(parsedUserData.username)
        }
    }

    async function settingFilter(){
        const storedFilterData = await AsyncStorage.getItem('filterData')
        if (storedFilterData) {
          const parsedFilterData = JSON.parse(storedFilterData)
          setFilterMaximumDays(parsedFilterData.filterMaximumDays)
          setFilterMaximumDistance(parsedFilterData.filterMaximumDistance)
        }
    }

    
    const fetchData = async () => {
        const data = { requestingUser: username, latUser: latUser, lonUser: lonUser, maximumDays: getMaximumDaysRealValueFromKey(filterMaximumDays), maximumDistance: getMaximumDistanceRealValueFromKey(filterMaximumDistance)}
            setIsLoadingItems(true)
            try {
                const response = await fetch('http://192.168.1.249:8000/api/getbirdswithfilter', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Dati da inviare nel corpo della richiesta
              })
              console.log(data)
              setDataOfLastFilterUpdate(data)
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
        fetchData()
        setDetailBirdModalIsVisible(false)
    }

    function openDetailBirdModal(id, username){
        setAuthorUsernameForDetailBirdModal(username)
        setBirdIdForDetailBirdModal(id)
        setDetailBirdModalIsVisible(true)
    }

    function openFilterModal(){
        setfilterModalIsVisible(true)
    }

    function closeFilterModal(){
        settingFilter()
        fetchData()
        setfilterModalIsVisible(false)
    }

    async function updateFilterData(maximumDays, maximunDistance){
        
        setFilterMaximumDays(maximumDays)
        setFilterMaximumDistance(maximunDistance)
        await AsyncStorage.setItem('filterData', JSON.stringify({filterMaximumDays: maximumDays, filterMaximumDistance: maximunDistance}))
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
                    originPage={"LatestSightings"} 
                    closeModal={closeDetailBirdModal} 
                    authorUsername={authorUsernameForDetailBirdModal}
                    loggedUsername={username}
                />
                <FilterLatestSightingsPage 
                    visible={filtermodalIsVisible}
                    closeModal={closeFilterModal}
                    updateFilterData={updateFilterData}
                    maximumDaysDefault={filterMaximumDays}
                    maximumDistanceDefault={filterMaximumDistance}
                />
                <View style={styles.container}>
                    <ScrollView style={styles.scrollViewcontainer}>
                        <View style={styles.ItemsContainer}>
                            {birdsData.map((item) => (
                            <View key={item.id}>
                                <BirdItemLatestSightings 
                                    id={item.id} 
                                    name={item.name} 
                                    image={{ uri: 'http://192.168.1.249:8000/api/getbird/' + item.id + '/' + username}} 
                                    sightingDate={item.sightingDate} 
                                    likes={item.likes} 
                                    distance={Math.round(item.distance)}
                                    userPutLike={item.userPutLike} 
                                    loggedUsername={username}
                                    onBirdPressed={() => openDetailBirdModal(item.id, item.user)}
                                />
                            </View>
                            ))}
                        </View>
                        <View style={styles.bottomFiller}></View>
                    </ScrollView>
                    <Pressable style={styles.floatingButton} onPress={openFilterModal}>
                        <Text style={styles.buttonText}>Open Filters</Text>
                    </Pressable>
                </View>
            </>
        }
        </>
    )
}

export default LatestSightingsPage

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
        flex: 1,
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
    button: {
        height: 200,
        color: 'red',
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
        elevation: 3, // Ombra su Android
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
    scrollViewcontainer: {
        paddingBottom: 60
    },
    bottomFiller: {
        height: 120
    }
})