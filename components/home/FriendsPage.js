import { View, Text, StyleSheet} from "react-native"
import { useIsFocused } from '@react-navigation/native';

function FriendsPage(props) {
    const isFocused = useIsFocused();
    
    return (
        <View style={styles.container}>
            <Text>Frineds Page</Text>
        </View>
    )
}

export default FriendsPage

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
})