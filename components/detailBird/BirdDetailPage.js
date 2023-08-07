import { View, StyleSheet, Modal, Text, Image, ScrollView, Dimensions, ActivityIndicator } from "react-native"
import DetailBirdHeaderBar from "../headerBars/DetailBirdHeaderBar"
import { useEffect, useState } from "react"
import MapView, { Marker } from 'react-native-maps'
import { calculateOptimizedImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"

const windowWidth = Dimensions.get('window').width

function BirdDetailPage(props){
    const [birdData, setBirdData] = useState([])
    const [isLoadingBirdData, setIsLoadingBirdData] = useState(true)
    const [birdImageWidth, setBirdImageWidth] = useState(0)
    const [birdImageHeight, setBirdImageHeight] = useState(0)

    const imageUrl = 'http://192.168.1.249:8000/api/getbird/' + props.id;

    useEffect(() => {
        if(props.visible){
            calculateOptimizedImageSize(imageUrl, setBirdImageWidth, setBirdImageHeight)
            fetchData()
        } 
    }, [props.visible])

    const fetchData = async () => {
        try {
          const response = await fetch(imageUrl)
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
        setIsLoadingBirdData(true)
        props.closeModal()
    }

    function getBirdDetails(){
        return(
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                <DetailBirdHeaderBar birdName={birdData.name} onBackButtonPress={closeModal} />
                </View>
                <ScrollView>
                    {birdData.id === -1 ? null : (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: imageUrl }} style={[styles.birdImage, imageSizeStyle]} />
                        </View>
                    )}
                    <View style={styles.textContainer}>
                        <View style={styles.textOnOneRow}>
                            <Text style={styles.boldText}>Sighted on the: </Text>
                            <Text style={styles.text}>{birdData.sightingDate}</Text>
                        </View>
                        <View style={styles.personalNotes}>
                            <Text style={styles.boldText}>Personal Notes: </Text>
                            <Text style={styles.text}>{birdData.personalNotes}</Text>
                        </View>
                </View>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{        
                            latitude: birdData.xPosition,
                            longitude: birdData.yPosition,
                            latitudeDelta: 1,
                            longitudeDelta: 1,}}
                    >
                        <Marker
                        coordinate={{
                            latitude: birdData.xPosition,
                            longitude: birdData.yPosition,
                        }}
                        />
                    </MapView>
                </View>
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

export default BirdDetailPage

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
    textContainer: {
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
    textOnOneRow: {
        flexDirection: 'row',
    },
    text: {
        fontSize: 18,
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
    personalNotes: {
        marginTop:10,
    },
    mapContainer: {
        height: 350, // Imposta un'altezza appropriata per il componente MapView
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 20,
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
      },
    map: {
    ...StyleSheet.absoluteFillObject,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})