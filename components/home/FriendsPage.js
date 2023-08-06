import { View, Text, StyleSheet, ScrollView} from "react-native"
import { useIsFocused } from '@react-navigation/native'
import FriendItem from "../items/FriendItem"

function FriendsPage(props) {
    const isFocused = useIsFocused();

    const data = [
        {name: 'Paolo', id: 1, icon: require('../../assets/images/personPic/Paolo.jpg'), dateLastSighting: '2023-07-31'},
        {name: 'Gianni', id: 2, icon: require('../../assets/images/personPic/Gianni.jpg'), dateLastSighting: '2023-07-30'},
        {name: 'Marina', id: 3, icon: require('../../assets/images/personPic/Marina.jpg'), dateLastSighting: '2023-07-29'},
        {name: 'Vincent', id: 4, icon: require('../../assets/images/personPic/default.png'), dateLastSighting: '2023-07-28'},
        {name: 'Lucia', id: 5, icon: require('../../assets/images/personPic/Lucia.jpg'), dateLastSighting: '2023-07-27'},
        {name: 'Saul', id: 6, icon: require('../../assets/images/personPic/Saul.jpg'), dateLastSighting: '2023-07-26'},
        {name: 'Riccardo', id: 7, icon: require('../../assets/images/personPic/Riccardo.jpg'), dateLastSighting: '2023-07-25'},
        {name: 'Luca', id: 8, icon: require('../../assets/images/personPic/Luca.jpg'), dateLastSighting: '2023-07-24'},
        {name: 'Sara', id: 9, icon: require('../../assets/images/personPic/Sara.jpg'), dateLastSighting: '2023-01-23'},
        {name: 'Karen', id: 10, icon: require('../../assets/images/personPic/Karen.jpg'), dateLastSighting: '2023-07-22'},
        {name: 'Sonia', id: 11, icon: require('../../assets/images/personPic/Sonia.jpg'), dateLastSighting: '2022-07-21'},
        {name: 'Brian', id: 12, icon: require('../../assets/images/personPic/default.png'), dateLastSighting: '2022-08-20'},
    ];
    
    return (
        <ScrollView style={styles.container}>
            <View style={styles.ItemsContainer}>
                {data.map((item) => (
                <View key={item.id}>
                    <FriendItem id={item.id} name={item.name} icon={item.icon} dateLastSighting={item.dateLastSighting}/>
                </View>
                ))}
            </View>
      </ScrollView>
    )
}

export default FriendsPage

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