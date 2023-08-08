import { View, Text, StyleSheet} from "react-native"

function TextInDetailBird(props) {
    return (
        <>
            <View style={styles.textOnOneRow}>
                <Text style={styles.boldText}>Sighted on the: </Text>
                <Text style={styles.text}>{props.sightingDate}</Text>
            </View>
            <View style={styles.personalNotes}>
                <Text style={styles.boldText}>Personal Notes: </Text>
                <Text style={styles.text}>{props.personalNotes}</Text>
            </View>
        </>
    )
}

export default TextInDetailBird

const styles = StyleSheet.create({
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