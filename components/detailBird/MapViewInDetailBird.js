import { View, StyleSheet, Pressable, Text} from "react-native"
import MapView, { Marker } from 'react-native-maps'
import { useState } from "react"
import Icon from 'react-native-vector-icons/FontAwesome'

function MapViewInDetailBird(props) {
    const [enableMapScrolling, setEnableMapScrolling] = useState(false)

    const CustomIcon = ({ name, size, color }) => {
        const IconComponent = Icon;
        return <IconComponent name={name} size={size} color={color} />;
    }

    const handlePress = () => {
        setEnableMapScrolling(true)
    }

    return (
        <Pressable onPress={handlePress}>
            <View style={styles.locationContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Press on the map to navigate it!</Text>
                    <View style={styles.icon}>
                        <CustomIcon name={enableMapScrolling ? "unlock" : "lock"} size={25} color="black" />
                    </View>
                </View>
                <View style={styles.mapContainer}>
                    <MapView
                    onPress={handlePress}
                        style={styles.map}
                        initialRegion={{        
                            latitude: props.xPosition,
                            longitude: props.yPosition,
                            latitudeDelta: 1,
                            longitudeDelta: 1,}}
                            scrollEnabled={enableMapScrolling}              
                    >
                        <Marker
                        coordinate={{
                            latitude: props.xPosition,
                            longitude: props.yPosition,
                        }}
                        />
                    </MapView>
                </View>
            </View>
        </Pressable>
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
        padding: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locationContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
    text: {
        fontSize: 18,
        paddingBottom: 10,
    },
    rowContainer: {
        flexDirection: 'row',
    },
    icon: {
        flex: 1, 
        alignItems: 'flex-end',
    }
})