import { View, Text, StyleSheet, ScrollView} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import BirdItemLatestSightings from "../items/BirdItemLatestSightings"

function LatestSightingsPage(props) {
    const isFocused = useIsFocused();
    
    const data = [
        {name: 'Passero', id: 1, icon: require('../../assets/images/birds/passero.jpg'), author: 'Luca'},
        {name: 'Usignolo', id: 2, icon: require('../../assets/images/birds/defaultBird.jpg'), author: 'Saul'},
        {name: 'Piccione', id: 3, icon: require('../../assets/images/birds/piccione.jpg'), author: 'Riccardo'},
        {name: 'Passero', id: 4, icon: require('../../assets/images/birds/passero.jpg'), author: 'Sara'},
        {name: 'Tortora', id: 5, icon: require('../../assets/images/birds/tortora.jpg'), author: 'Karen'},
        {name: 'Pettirosso', id: 6, icon: require('../../assets/images/birds/pettirosso.jpg'), author: 'Brian'},
        {name: 'Cornacchia', id: 7, icon: require('../../assets/images/birds/cornacchia.jpg'), author: 'Sonia'},
        {name: 'Passero', id: 8, icon: require('../../assets/images/birds/passero.jpg'), author: 'Brian'},
        {name: 'Usignolo', id: 9, icon: require('../../assets/images/birds/defaultBird.jpg'), author: 'Marina'},
        {name: 'Piccione', id: 10, icon: require('../../assets/images/birds/piccione.jpg'), author: 'Luca'},
        {name: 'Passero', id: 11, icon: require('../../assets/images/birds/passero.jpg'), author: 'Lucia'},
        {name: 'Tortora', id: 12, icon: require('../../assets/images/birds/tortora.jpg'), author: 'Paolo'},
        {name: 'Pettirosso', id: 13, icon: require('../../assets/images/birds/pettirosso.jpg'), author: 'Gianni'},
        {name: 'Cornacchia', id: 14, icon: require('../../assets/images/birds/cornacchia.jpg'), author: 'Sonia'},
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.ItemsContainer}>
                {data.map((item) => (
                <View key={item.id}>
                    <BirdItemLatestSightings id={item.id} name={item.name} icon={item.icon} author={item.author}/>
                </View>
                ))}
            </View>
      </ScrollView>
    )
}

export default LatestSightingsPage

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
    },
})