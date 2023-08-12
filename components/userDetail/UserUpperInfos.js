import { StyleSheet, View, Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Feather } from '@expo/vector-icons';

function UserUpperInfos(props){
    return(
        <>
            <View style={styles.rowContainer}>
                <View style={[styles.container, styles.flexContainer]}>
                    <Text style={styles.likesText}>Likes: {props.likes}</Text>
                    <MaterialCommunityIcons
                        name={"heart"}
                        size={32}
                        color={"red"}
                        style={styles.heart}
                    />
                </View>
                <View style={[styles.container, styles.flexContainer]}>
                    <Text style={styles.followersText}>Followers: {props.followers}</Text>
                    <Feather
                        name={"user"}
                        size={32}
                        color={"blue"}
                        style={styles.heart}
                    />
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>{props.state}</Text>
            </View>
        </>
    )
}

export default UserUpperInfos

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    android: {
        elevation: 8,
    },
    default: {},
})

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
    },
    likesText: {
        paddingTop: 2,
        fontSize: 18,
        flex: 1,
    },
    followersText: {
        paddingTop: 2,
        fontSize: 18,
        flex: 1
    },
    container: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        flexDirection: 'row',
        ...shadowStyle
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexContainer: {
        flex: 1, 
    },
    heart: {
        marginBottom: 0,
    },
})