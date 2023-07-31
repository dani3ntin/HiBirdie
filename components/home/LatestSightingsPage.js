import { View, Text, StyleSheet} from "react-native"
import { useIsFocused } from '@react-navigation/native';

function LatestSightingsPage(props) {
    const isFocused = useIsFocused();
    
    return (
        <View style={styles.container}>
            <Text>Latest Sightings Page</Text>
        </View>
    )
}

export default LatestSightingsPage

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
})