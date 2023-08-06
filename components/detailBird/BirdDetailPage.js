import { View, StyleSheet, Modal, Text, Image, ScrollView, Dimensions  } from "react-native"
import DetailBirdHeaderBar from "../headerBars/DetailBirdHeaderBar"
import { useEffect } from "react"

function BirdDetailPage(props){

    const data = [
        {name: 'Passero', id: 1, icon: require('../../assets/images/birds/passero.jpg'), date: '10/20/2020'},
        {name: 'Usignolo', id: 2, icon: require('../../assets/images/birds/usignolo.jpg'), date: '10/20/2020'},
        {name: 'Piccione', id: 3, icon: require('../../assets/images/birds/piccione.jpg'), date: '10/20/2020'},
        {name: 'Passero', id: 4, icon: require('../../assets/images/defaultBirds/passero.jpg'), date: '10/20/2020'},
        {name: 'Tortora', id: 5, icon: require('../../assets/images/defaultBirds/tortora.jpg'), date: '10/20/2020'},
        {name: 'Pettirosso', id: 6, icon: require('../../assets/images/defaultBirds/pettirosso.jpg'), date: '10/20/2020'},
        {name: 'Cornacchia', id: 7, icon: require('../../assets/images/defaultBirds/cornacchia.jpg'), date: '10/20/2020'},
        {name: 'Passero', id: 8, icon: require('../../assets/images/defaultBirds/passero.jpg'), date: '10/20/2020'},
        {name: 'Usignolo', id: 9, icon: require('../../assets/images/defaultBirds/defaultBird.jpg'), date: '10/20/2020'},
        {name: 'Piccione', id: 10, icon: require('../../assets/images/birds/piccione.jpg'), date: '10/20/2020'},
        {name: 'Passero', id: 11, icon: require('../../assets/images/defaultBirds/passero.jpg'), date: '10/20/2020'},
        {name: 'Tortora', id: 12, icon: require('../../assets/images/defaultBirds/tortora.jpg'), date: '10/20/2020'},
        {name: 'Pettirosso', id: 13, icon: require('../../assets/images/defaultBirds/pettirosso.jpg'), date: '10/20/2020'},
        {name: 'Cornacchia', id: 14, icon: require('../../assets/images/defaultBirds/cornacchia.jpg'), date: '10/20/2020'},
    ];

    function closeModal(){
        props.closeModal()
    }

    function extractBirdFromId(){
        const bird = data.filter((bird) => bird.id === props.id)[0]
        if(bird === undefined) return {name: '', id: -1, icon: '', date: ''}
        return bird
    }

    return (
        <Modal visible={props.visible} animationType='slide' onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <DetailBirdHeaderBar birdName={extractBirdFromId().name} onBackButtonPress={closeModal} />
            </View>
            <ScrollView style={styles.scrollView}>
              <View>
                {extractBirdFromId().id === -1 ? null : (
                  <Image source={extractBirdFromId().icon} style={styles.birdImage} />
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
              </View>
            </ScrollView>
          </View>
        </Modal>
      )
}

export default BirdDetailPage

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    scrollView :{
        
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#e9e7e7',
    },
    headerContainer: {
        height: '8%'
    },
    textContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        elevation: 5, //android shadow
        shadowColor: 'black',//apple shadow
        shadowOffset: { width: 0, height: 2 },//apple shadow
        shadowOpacity: 0.5,//apple shadow
        shadowRadius: 4,//apple shadow
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
        width: windowWidth - 40, // Utilizziamo la larghezza dello schermo meno il margine sinistro e destro (totale 40)
        height: windowWidth - 100, // L'altezza sarà il 50% della larghezza per mantenere l'aspect ratio
        borderRadius: 10,
        margin: 20,
    },
    personalNotes: {
        marginTop:10,
    },
})