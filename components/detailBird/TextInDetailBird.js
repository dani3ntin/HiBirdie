import { View, Text, StyleSheet} from "react-native"

function TextInDetailBird(props) {
    return (
        <View style={styles.textContainer}>
            <View style={styles.textOnOneRow}>
                <Text style={styles.boldText}>Sighted on the: </Text>
                <Text style={styles.text}>{props.sightingDate}</Text>
            </View>
            <View style={styles.personalNotes}>
                <Text style={styles.boldText}>Personal Notes: </Text>
                <Text style={styles.text}>{props.personalNotes}</Text>
            </View>
        </View>
    )
}

export default TextInDetailBird

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
    boldText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    text: {
        fontSize: 18,
    },
    personalNotes: {
        marginTop:10,
    },
})