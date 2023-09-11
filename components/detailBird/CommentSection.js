import { View, Text, StyleSheet, Image, ActivityIndicator, TextInput, Pressable, KeyboardAvoidingView, Platform} from "react-native"
import { useState, useEffect } from "react"
import { useGlobalContext } from "../globalContext/GlobalContext"
import { useNavigation } from "@react-navigation/native"


function CommentSection(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const [commentsData, setCommentsData] = useState([])
    const [isLoadingItems, setIsLoadingItems] = useState(true)
    const [commentText, setCommentText] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        fetchCommentsData()
    }, [])

    async function fetchCommentsData(){
        const responseComments = await fetch(globalVariable.API_URL + 'getcommentsbybird/' + props.bird + '/' + props.loggedUsername)
        if (!responseComments.ok) {
            throw new Error('Network response was not ok')
        }
        const jsonComments = await responseComments.json()
        setCommentsData(jsonComments)
        setIsLoadingItems(false)
    }

    function checkCommentText(){
        if(commentText !== '')
            addComment()
    }

    async function addComment(){
        let formData = new FormData()
        formData.append('bird', props.bird)
        formData.append('user', props.loggedUsername)
        formData.append('commentText', commentText)
        
        try {
            const response = await fetch(globalVariable.API_URL + 'addcomment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
            console.log(response.status)
            setCommentText('')
            fetchCommentsData()
        } catch (error) {
            console.error(error);
        }
    }

    function onUserPressedHandler(usernameFollowed, nameFollowed, stateFollowed, likesFollowed, nOfFollowersFollowed, isLoggedUserFollowing){
        navigation.navigate('UserDetailPage', {usernameFollowed: usernameFollowed, nameFollowed: nameFollowed, stateFollowed: stateFollowed, likesFollowed: likesFollowed,
            nOfFollowersFollowed: nOfFollowersFollowed, isLoggedUserFollowing: isLoggedUserFollowing, loggedUsername: props.loggedUsername})
    }

    return (
        <>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Inster comment'
                    errorStyle={{ color: 'red' }}
                    value={commentText}
                    onChangeText={text => setCommentText(text)}
                    maxLength={500}
                    style={styles.textInputBar}
                    multiline
                    scrollEnabled={false}
                />
            </View>
            <Pressable 
                style={({ pressed }) => [
                    styles.insertComment,
                    {backgroundColor: globalVariable.buttonColor},
                    pressed && { backgroundColor: '#929292' }
                ]}
                onPress={checkCommentText}
            >
                <Text style={styles.text}>Add a comment</Text>
            </Pressable>
            {
                isLoadingItems ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large"  color="#ff0000"/>
                </View>
                :
                <>
                {
                    commentsData.length === 0 ?
                    <View>
                        <Text style={styles.text}>There are no comments yet!</Text>
                    </View>
                    :
                    <>
                        {commentsData.map((item) => (
                            <View key={item.id} style={styles.commentContainer}>
                                <View style={styles.commentItem}>
                                    <Pressable
                                        onPress={() => onUserPressedHandler(item.user, item.name, item.state, item.like, item.followers, item.isLoggedUserFollowing, props.loggedUsername)}
                                    >
                                        <Image
                                            source={{ uri: globalVariable.API_URL + 'getusericonbyusername/' + item.user }}
                                            style={[styles.avatar, { alignSelf: 'flex-start' }]}
                                        />
                                    </Pressable>
                                    <View style={styles.commentContent}>
                                        <Pressable
                                            onPress={() => onUserPressedHandler(item.user, item.name, item.state, item.like, item.followers, item.isLoggedUserFollowing, props.loggedUsername)}
                                        >
                                            <Text style={styles.commentName}>{item.name}</Text>
                                        </Pressable>
                                        <Text style={styles.commentState}>
                                            {item.commentText}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                }
                </>
            }
        </>
    )
}

export default CommentSection

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        paddingBottom: 20,
    },
    commentContent: {
        flex: 1,
        marginLeft: 1, // Aggiungi spazio tra l'immagine e il testo
    },
    commentContainer: {
        paddingBottom: 10,
    },
    commentItem: {
        borderRadius: 10,
        backgroundColor: '#ffffff',
        borderBlockColor: 'black',
        borderWidth: 1,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentName: {
        color: 'black',
        paddingTop: 4,
        paddingLeft: 8,
        fontSize: 19,
        fontWeight: 'bold',
    },
    commentState: {
        color: 'black',
        paddingLeft: 8,
        fontSize: 18,
    },
    pressedItem: {
        opacity: 0.5,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 100,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pressedItem: {
        opacity: 0.5,
    },
    text: {
        fontSize: 18,
    },
    textInputBar: {
        fontSize: 18,
        backgroundColor: '#edebeb',
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 5,
        width: '100%'
    },
    insertComment: {
        bottom: 20,
        width: 200,
        height: 60,
        borderWidth: 2,
        paddingVertical: 10,
        borderColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
      },
})