import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import BirdItemEncyclopedia from "../items/BirdItemEncyclopedia"
import { useState } from "react"
import { useEffect } from "react"
import { changeDateFormatToDDMMYYYY } from "../utils/utils"
import { useNavigation } from "@react-navigation/native"
import { useGlobalContext } from "../globalContext/GlobalContext"

function EncyclopediaPage(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const isFocused = useIsFocused()
    const [birdsData, setBirdsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)

    const navigation = useNavigation()

    useEffect(() => {
        if(isFocused){
            fetchData()
        } 
    }, [isFocused, props.username])

    const fetchData = async () => {
        try {
          const response = await fetch(globalVariable.API_URL + 'getbirdsbyuser/' + props.username + '/' + props.username)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const jsonData = await response.json()
      
          setBirdsData(jsonData)
          setIsLoadingItems(false)
          
        } catch (error) {
          console.error('Encyclopedia Error on getting the datas:', error)
          setIsLoadingItems(false)
        }
    }


    function openDetailBirdPage(id){
        navigation.navigate('BirdDetailPageWithoutAuthor', { loggedUsername: props.username, id: id, originPage: "Encyclopedia" })
    }

    function openAddNewBirdModal(){
        navigation.navigate('AddBird')
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
                <ScrollView style={[styles.container, {backgroundColor: globalVariable.backgroundColor}]}>
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
                                image={{ uri: globalVariable.API_URL + 'getbirdicon/' + item.id + globalVariable.randomStringToUpdate }} 
                                sightingDate={changeDateFormatToDDMMYYYY(item.sightingDate)} 
                                onBirdPressed={openDetailBirdPage}/>
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
    bottomFiller: {
        height: 70,
        backgroundColor: '#e9e7e7',
    },
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
        bottom: 20,
        width: 200,
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