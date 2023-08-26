import { View, Button, StyleSheet, ScrollView, ActivityIndicator, Pressable, Text,TouchableOpacity} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import BirdItemLatestSightings from "../items/BirdItemLatestSightings"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import FilterLatestSightingsPage from "../filterLatestSightingsPage/FilterLatestSightingsPage"
import { getMaximumDaysRealValueFromKey, getMaximumDistanceRealValueFromKey } from "../filterLatestSightingsPage/MapKeyValueFilter"
import { useNavigation } from "@react-navigation/native"
import { useGlobalContext } from "../globalContext/GlobalContext"
import * as Sentry from '@sentry/react-native'

function LatestSightingsPage(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const isFocused = useIsFocused()
    const [filtermodalIsVisible, setfilterModalIsVisible] = useState(false)
    const [birdsData, setBirdsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [filterMaximumDays, setFilterMaximumDays] = useState(0)
    const [filterMaximumDistance, setFilterMaximumDistance] = useState(0)
    const [latUser, setLatUser] = useState(0)
    const [lonUser, setLonUser] = useState(0)
    const [defaultPosition, setDefaultPosition] = useState(false)

    const navigation = useNavigation()

    useEffect(() => {
        if(isFocused){
            settingUserCoordinates()
            settingFilter()
            fetchData()
        } 
    }, [isFocused , props.username, filterMaximumDays, filterMaximumDistance])

    async function settingUserCoordinates(){
        const storedCoordinatesUserData = await AsyncStorage.getItem('userCoordinates')
        //console.log('storedCoordinatesUserData:')
        //console.log(storedCoordinatesUserData)
        if (storedCoordinatesUserData) {
          const parsedUserData = JSON.parse(storedCoordinatesUserData)
          setLatUser(parsedUserData.latitude)
          setLonUser(parsedUserData.longitude)
          if(parsedUserData.defaultPosition)
            setDefaultPosition(true)
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
        const data = { requestingUser: props.username, latUser: latUser, lonUser: lonUser, maximumDays: getMaximumDaysRealValueFromKey(filterMaximumDays), maximumDistance: getMaximumDistanceRealValueFromKey(filterMaximumDistance)}
        //console.log('getbirdswithfilterexceptyours:')
        //console.log(data)
        try {
            const response = await fetch(globalVariable.API_URL + 'getbirdswithfilterexceptyours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage)
            }
            const jsonData = await response.json()
        
            setBirdsData(jsonData)
            setIsLoadingItems(false)
            
            } catch (error) {
            console.error('Latest sighting Error on getting the datas:', error)
            setIsLoadingItems(false)
        }
    }

    function openDetailBirdPage(id, username){
        navigation.navigate('BirdDetailPageWithAuthor', { loggedUsername: props.username, id: id, originPage: "LatestSightings", authorUsername: username})
    }

    function openFilterModal(){
        setfilterModalIsVisible(true)
    }

    function closeFilterModal(){
        setIsLoadingItems(true)
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
            <View style={[styles.loadingContainer, {backgroundColor: globalVariable.backgroundColor}]}>
                <ActivityIndicator size="large"  color="#0000ff"/>
            </View>
            :
            <>
                <FilterLatestSightingsPage 
                    visible={filtermodalIsVisible}
                    closeModal={closeFilterModal}
                    updateFilterData={updateFilterData}
                    maximumDaysDefault={filterMaximumDays}
                    maximumDistanceDefault={filterMaximumDistance}
                />
                <View style={[styles.container, {backgroundColor: globalVariable.backgroundColor}]}>
                    <ScrollView style={styles.scrollViewcontainer}>
                        {
                            birdsData.length === 0 ?
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>No birds found!</Text>
                                <Text style={styles.text}>Try changing the filter settings</Text>
                            </View>
                            :
                            <View style={styles.ItemsContainer}>
                                {birdsData.map((item) => (
                                <View key={item.id}>
                                    <BirdItemLatestSightings 
                                        id={item.id} 
                                        name={item.name} 
                                        image={{ uri: globalVariable.API_URL + 'getbird/' + item.id + '/' + props.username}} 
                                        sightingDate={item.sightingDate} 
                                        likes={item.likes} 
                                        distance={Math.round(item.distance)}
                                        userPutLike={item.userPutLike} 
                                        loggedUsername={props.username}
                                        onBirdPressed={() => openDetailBirdPage(item.id, item.user)}
                                        defaultPosition={defaultPosition}
                                    />
                                </View>
                                ))}
                            </View>
                        }
                        <View style={[styles.bottomFiller, {backgroundColor: globalVariable.backgroundColor}]}></View>
                    </ScrollView>
                    <Pressable 
                        style={({ pressed }) => [
                            styles.floatingButton,
                            {backgroundColor: globalVariable.buttonColor},
                            pressed && { opacity: 0.8, backgroundColor: '#929292' }
                        ]} 
                        onPress={openFilterModal} 
                    >
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
        flex: 1,
    },
    ItemsContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        ...shadowStyle,
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
        bottom: 20,
        width: 200,
        height: 50,
        borderWidth: 2,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
    scrollViewcontainer: {
        paddingBottom: 60,
    },
    bottomFiller: {
        height: 70,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    text: {
        fontSize: 18
    }
})