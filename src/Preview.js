import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom';
import {resetCameraImage, selectCameraImage} from './features/cameraSlice'
import './Preview.css'
import CloseIcon from '@material-ui/icons/Close';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import CreateIcon from '@material-ui/icons/Create';
import NoteIcon from '@material-ui/icons/Note';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CropIcon from '@material-ui/icons/Crop';
import TimerIcon from '@material-ui/icons/Timer';
import SendIcon from '@material-ui/icons/Send';
import {v4 as uuid} from 'uuid'
import {db, storage} from './firebase'
import {collection, serverTimestamp, setDoc, doc} from 'firebase/firestore';
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {selectUser} from './features/appSlice';

function Preview() {
    const cameraImage = useSelector(selectCameraImage)
    const history = useHistory();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();


    useEffect(() => {
        if (!cameraImage) {
            history.replace('/');
        }
    }, [cameraImage, history])

    const closePreview = () => {
        dispatch(resetCameraImage())
    }

    const sendPost = () => {
        const id = uuid();
        uploadString(ref(storage, `posts/${id}`), cameraImage, 'data_url')
            .then(() => {
                getDownloadURL(ref(storage, `posts/${id}`)).then(async (url) => {
                    await setDoc(doc(collection(db, 'posts')), {
                        imageUrl: url,
                        username: user.username,
                        read: false,
                        profilePic: user.profilePic,
                        timestamp: serverTimestamp()
                    }, {merge: true})
                    history.replace('/chats');
                });
            })
    }

    return (
        <div className="preview">
            <CloseIcon onClick={closePreview} className="preview__close"/>
            <div className="preview__toolbarRight">
                <TextFieldsIcon/>
                <CreateIcon/>
                <NoteIcon/>
                <MusicNoteIcon/>
                <AttachFileIcon/>
                <CropIcon/>
                <TimerIcon/>
            </div>
            <img src={cameraImage} alt="Not  found!!"/>
            <div onClick={sendPost} className="preview__footer">
                <h2>Send Now</h2>
                <SendIcon fontSize="small" className="preview__sendIcon"/>
            </div>
        </div>
    )
}

export default Preview
