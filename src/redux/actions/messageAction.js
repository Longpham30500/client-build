import { DeleteData, GLOBALTYPES } from './globalTypes';
import {deleteDataAPI, postDataAPI, getDataAPI} from '../../utils/fetchData'

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
}   

export const addUser = ({user, message}) => async (dispatch) =>{
    if(message.users.every(item => item._id !== user._id)){
        dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text:'',media:[]}})
    }
}

export const addMessage = ({msg, auth, socket}) => async (dispatch) =>{
    dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})

    socket.emit('createMessage', {...msg})
    try{
        await postDataAPI('message',msg,auth.token)
    }catch (error) {
        dispatch({type:GLOBALTYPES.ALERT, payload:{error:error.response.data.msg}})
    }
}

export const getConversations = ({auth, page = 1}) => async (dispatch) =>{
    try{
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token)
        let newArr = [];
        res.data.conversations.forEach(item =>{
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id){
                    newArr.push({...cv, text: item.text, media: item.media})
                }
            })
        })
        dispatch({type: MESS_TYPES.GET_CONVERSATIONS, payload: {newArr, result: res.data.result}})

    }catch(error){
        dispatch({type:GLOBALTYPES.ALERT, payload:{error:error.response.data.msg}})
    }
}

export const getMessages = ({auth, id, page = 1}) => async (dispatch) =>{
    try{
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`,auth.token)
        dispatch({type: MESS_TYPES.GET_MESSAGES, payload:res.data})

    }catch(error){
        dispatch({type:GLOBALTYPES.ALERT, payload:{error:error.response.data.msg}})

    }
}

export const deleteMessages = ({msg, message, auth}) => async (dispatch) => {
    const newData = DeleteData(message.data, msg._id, auth.token)
    dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload:{newData, _id: msg.recipient}})
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token)
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT, payload: {error: error.response.data.msg}
        })
    }
}

export const deleteConversation = ({auth, id}) => async (dispatch) => {
    dispatch({
        type: MESS_TYPES.DELETE_CONVERSATION,
        payload: id
    })
    try {
        await deleteDataAPI(`conversation/${id}`, auth.token)
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT, payload: {error: error.response.data.msg}
        })
    }
}