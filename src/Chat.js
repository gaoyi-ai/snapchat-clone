import {Avatar} from '@material-ui/core'
import React from 'react'
import './Chat.css'
import StopRoundIcon from '@material-ui/icons/StopRounded'
import ReactTimeago from 'react-timeago'
import {selectCameraImage} from './features/cameraSlice'
import {selectImage} from './features/appSlice'
import {useDispatch} from 'react-redux'
import {db} from './firebase';
import {useHistory} from 'react-router-dom'
import {doc, updateDoc} from "firebase/firestore";


function Chat({id, username, timestamp, read, imageUrl, profilePic}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const open = () => {
        if (!read) {
            dispatch(selectImage(imageUrl))
            updateDoc(doc(db, 'posts', id), {
                read: true
            })
        }
        history.push('/chats/view')
    }
    return (
        <div onClick={open} className="chat">
            <Avatar className="chat__avatar" src={profilePic}/>
            <div className="chat__info">
                <h4>{username}</h4>
                <p>
                    {!read && "Tap to view"}{" "} - <ReactTimeago date={new Date(timestamp?.toDate()).toUTCString()}/>
                </p>
            </div>
            {!read && <StopRoundIcon className="chat__readIcon"/>}
        </div>
    )
}

export default Chat
