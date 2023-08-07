import { View, StyleSheet, Modal, Text, Image, ScrollView, Dimensions  } from "react-native"
import DetailBirdHeaderBar from "../headerBars/DetailBirdHeaderBar"
import { useEffect } from "react"
import MapView, { Marker } from 'react-native-maps';

function BirdDetailPage(props){

    const data = [
        {name: 'Passero', id: 1, image: require('../../assets/images/birds/passero.jpg'), date: '10/20/2020'},
        {name: 'Usignolo', id: 2, image: require('../../assets/images/birds/usignolo.jpg'), date: '10/20/2020'},
        {name: 'Piccione', id: 3, image: require('../../assets/images/birds/piccione.jpg'), date: '10/20/2020'},
        {name: 'Passero', id: 4, image: require('../../assets/images/defaultBirds/passero.jpg'), date: '10/20/2020'},
        {name: 'Tortora', id: 5, image: require('../../assets/images/defaultBirds/tortora.jpg'), date: '10/20/2020'},
        {name: 'Pettirosso', id: 6, image: require('../../assets/images/defaultBirds/pettirosso.jpg'), date: '10/20/2020'},
        {name: 'Cornacchia', id: 7, image: require('../../assets/images/defaultBirds/cornacchia.jpg'), date: '10/20/2020'},
        {name: 'Passero', id: 8, image: require('../../assets/images/defaultBirds/passero.jpg'), date: '10/20/2020'},
        {name: 'Usignolo', id: 9, image: require('../../assets/images/defaultBirds/defaultBird.jpg'), date: '10/20/2020'},
        {name: 'Piccione', id: 10, image: require('../../assets/images/birds/piccione.jpg'), date: '10/20/2020'},
        {name: 'Passero', id: 11, image: require('../../assets/images/defaultBirds/passero.jpg'), date: '10/20/2020'},
        {name: 'Tortora', id: 12, image: require('../../assets/images/defaultBirds/tortora.jpg'), date: '10/20/2020'},
        {name: 'Pettirosso', id: 13, image: require('../../assets/images/defaultBirds/pettirosso.jpg'), date: '10/20/2020'},
        {name: 'Cornacchia', id: 14, image: require('../../assets/images/defaultBirds/cornacchia.jpg'), date: '10/20/2020'},
    ];

    function closeModal(){
        props.closeModal()
    }

    function extractBirdFromId(){
        const bird = data.filter((bird) => bird.id === props.id)[0]
        if(bird === undefined) return {name: '', id: -1, image: '', date: ''}
        return bird
    }

    return (
        <Modal visible={props.visible} animationType='slide' onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <DetailBirdHeaderBar birdName={extractBirdFromId().name} onBackButtonPress={closeModal} />
            </View>
            <ScrollView>
                {extractBirdFromId().id === -1 ? null : (
                    <View style={styles.imageContainer}>
                        <Image source={extractBirdFromId().image} style={styles.birdImage} />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <View style={styles.textOnOneRow}>
                        <Text style={styles.boldText}>Sighted on the: </Text>
                        <Text style={styles.text}>{extractBirdFromId().date}</Text>
                    </View>
                    <View style={styles.personalNotes}>
                        <Text style={styles.boldText}>Personal Notes: </Text>
                        <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis felis ac tellus vehicula, ut porta dolor porta. Aliquam sit amet pharetra orci. Nam malesuada nisl eget ex convallis sagittis. Cras mollis gravida iaculis. Fusce sit amet tortor turpis. Vestibulum mollis quam nec lectus rhoncus, id lobortis purus aliquam. Etiam non lacus sed felis rhoncus placerat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam vel odio dolor. Curabitur congue vulputate vulputate. Fusce at dui sem. Cras lobortis vehicula lectus, a ultricies mi varius sit amet. Vivamus ac tempor est. Duis ante orci, elementum vel cursus nec, tempus et felis. Fusce purus lectus, blandit ac volutpat ac, tempor eu risus. Suspendisse eleifend, mauris non auctor consectetur, sem lorem egestas metus, non porta odio massa ut urna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent mattis nulla nec purus commodo, ut molestie tortor placerat. Suspendisse a diam justo. Curabitur sed suscipit ligula, a consequat libero. Nulla nec velit commodo, scelerisque turpis non, efficitur libero. Sed blandit massa eu leo sodales tempor.</Text>
                    </View>
              </View>
              <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                    latitude: 55,
                    longitude: 110,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                    coordinate={{
                        latitude: 55,
                        longitude: 110,
                    }}
                    />
                </MapView>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )
}

export default BirdDetailPage

const windowWidth = Dimensions.get('window').width

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
        width: windowWidth - 50, // Utilizziamo la larghezza dello schermo meno il margine sinistro e destro (totale 40)
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
})