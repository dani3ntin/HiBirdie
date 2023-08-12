import { View, StyleSheet} from "react-native"
import MapView, { Marker } from 'react-native-maps'

function MapViewInDetailBird(props) {
    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                initialRegion={{        
                    latitude: props.xPosition,
                    longitude: props.yPosition,
                    latitudeDelta: 1,
                    longitudeDelta: 1,}}
                    zoomEnabled={true}
                    scrollEnabled={true}
            >
                <Marker
                coordinate={{
                    latitude: props.xPosition,
                    longitude: props.yPosition,
                }}
                />
            </MapView>
        </View>
    )
}

export default MapViewInDetailBird

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
    mapContainer: {
        height: 350, // Imposta un'altezza appropriata per il componente MapView
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 20,
        padding: 20,
        ...shadowStyle
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})