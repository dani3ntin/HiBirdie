import { View, Text, StyleSheet, ScrollView, BackHandler} from "react-native"
import { useIsFocused } from '@react-navigation/native';
import BirdItemEncyclopedia from "../items/BirdItemEncyclopedia"
import BirdDetailPage from "../detailBird/BirdDetailPage";
import { useState } from "react"
import { useEffect } from "react"

function EncyclopediaPage(props) {
    const isFocused = useIsFocused()
    const [detailBirdmodalIsVisible, setDetailBirdModalIsVisible] = useState(false)
    const [birdIdForDetailBirdModal, setBirdIdForDetailBirdModal] = useState(-1)

    function closeDetailBirdModal(){
        setDetailBirdModalIsVisible(false)
    }

    function openDetailBirdModal(id){
        setBirdIdForDetailBirdModal(id)
        setDetailBirdModalIsVisible(true)
    }

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

    return (
        <>
            <BirdDetailPage visible={detailBirdmodalIsVisible} id={birdIdForDetailBirdModal} closeModal={closeDetailBirdModal} />
            <ScrollView style={styles.container}>
                <View style={styles.ItemsContainer}>
                    {data.map((item) => (
                    <View key={item.id}>
                        <BirdItemEncyclopedia id={item.id} name={item.name} icon={item.icon} date={item.date} onBirdPressed={openDetailBirdModal}/>
                    </View>
                    ))}
                </View>
            </ScrollView>
        </>
    )
}

export default EncyclopediaPage

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
        elevation: 5, //android shadow
        shadowColor: 'black',//apple shadow
        shadowOffset: { width: 0, height: 2 },//apple shadow
        shadowOpacity: 0.5,//apple shadow
        shadowRadius: 4,//apple shadow
    },
})