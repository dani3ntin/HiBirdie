import { View, StyleSheet, Modal, Text, Image, ScrollView, Dimensions, ActivityIndicator, Pressable, Alert } from "react-native"
import DetailBirdHeaderBar from "../headerBars/DetailBirdHeaderBar"
import { useEffect, useState } from "react"
import { calculateOptimizedImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"
import AuthorPressable from "./AuthorPressable"
import TextInDetailBird from "./TextInDetailBird"
import MapViewInDetailBird from "./MapViewInDetailBird"
import { changeDateFormatToDDMMYYYY } from "../utils/utils"
import DeleteBirdButton from "./DeleteBirdButton"
import { API_URL } from "../../env"

const windowWidth = Dimensions.get('window').width

function BirdDetailPageWithAuthor(props){
    const [birdData, setBirdData] = useState([])
    const [isLoadingBirdData, setIsLoadingBirdData] = useState(true)
    const [birdImageWidth, setBirdImageWidth] = useState(0)
    const [birdImageHeight, setBirdImageHeight] = useState(0)

    useEffect(() => {
        setIsLoadingBirdData(true)
        if(props.visible){
            calculateOptimizedImageSize(API_URL + 'getbird/' + props.id + '/' + props.loggedUsername, 50, setBirdImageWidth, setBirdImageHeight)
            fetchData()
        } 
    }, [props.visible])

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL + 'getbird/' + props.id + '/' + props.loggedUsername)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const imageMetadata = JSON.parse(response.headers.get('imageInfos'))
            setBirdData(imageMetadata)

            setIsLoadingBirdData(false)
        } catch (error) {
          console.error('Error on getting the datas:', error)
          setIsLoadingBirdData(false)
        }
    }

    const imageSizeStyle = {
        width: birdImageWidth || 200,
        height: birdImageHeight || 200,
    }

    function closeModal(){
        setBirdData([])
        props.closeModal()
    }

    async function deleteBird(){
        await fetch(API_URL + 'deletebird/' + birdData.id)
        closeModal()
    }

    function handleDeletePress(){
        Alert.alert(
            'Delete Bird',
            'Are you sure you want to delete this bird?',
            [
              { text: 'Cancel'},
              { text: 'OK', onPress: () => deleteBird() },
            ]
          );
    }
      
    function getBirdDetails(){
        return(
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                <DetailBirdHeaderBar id={birdData.id} birdName={birdData.name} loggedUsername={props.loggedUsername} onBackButtonPress={closeModal} likes={birdData.likes} userPutLike={birdData.userPutLike} />
                </View>
                <ScrollView>
                    {
                        birdData.id === -1 ? null : (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: API_URL + 'getbird/' + props.id + '/' + props.loggedUsername + '?' + Math.random(10) }} style={[styles.birdImage, imageSizeStyle]} />
                            </View>
                        )
                    }

                    <View style={styles.pressableAuthorContainer}>
                        <Text style={[styles.boldText, {paddingBottom: 10}]}>Sighted by:</Text>
                        <Pressable>
                            <AuthorPressable loggedUsername={props.loggedUsername} authorUsername={props.authorUsername}/>
                        </Pressable>
                    </View>

                    <View style={styles.textContainer}>
                        <TextInDetailBird sightingDate={changeDateFormatToDDMMYYYY(birdData.sightingDate)} personalNotes={birdData.personalNotes}/>
                    </View>
                    <MapViewInDetailBird xPosition={birdData.xPosition} yPosition={birdData.yPosition}/>
                    {
                        props.originPage === "Encyclopedia"
                        ?
                        <DeleteBirdButton handleDeletePress={handleDeletePress} />
                        : null
                    }
                </ScrollView>
            </View>
        )
    }

    return (
        <Modal visible={props.visible} animationType='slide' onRequestClose={closeModal}>
          {
            isLoadingBirdData ?
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"  color="#0000ff"/>
            </View>
            :
            getBirdDetails()
          }
        </Modal>
      )
}

export default BirdDetailPageWithAuthor

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    android: {
        elevation: 5,
    },
    default: {},
})

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#e9e7e7',
    },
    headerContainer: {
        height: '8%'
    },
    pressableAuthorContainer: {
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    birdImage: {
        borderRadius: 10,
        width: windowWidth - 50, 
        height: windowWidth - 110, // L'altezza sarà il 50% della larghezza per mantenere l'aspect ratio
        borderRadius: 10,
    },
    imageContainer:{
        ...shadowStyle,
        backgroundColor:'black',
        borderRadius: 10,
        margin: 25,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
})