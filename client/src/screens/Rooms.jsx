
import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from "react-player";
import { useSocket } from '../context/SocketProvider';
import peer from "../service/peer"



const RoomPage = () => {

    const socket = useSocket()
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState(null)

    const handleUserJoined = useCallback(
        ({ email, id }) => {
            console.log(`${email} joined`);
            setRemoteSocketId(id)
        },
    [])

    const handleCallUser = useCallback(async () => {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        const offer = await peer.getOffer();

        socket.emit("user:call", { to: remoteSocketId, offer })

        setMyStream(stream);

    }, [remoteSocketId, socket])

    const handleIncomingCall = useCallback(async ({ from, offer }) => {

        setRemoteSocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
        const answer = await peer.getAnswer(offer)
        socket.emit('call:accepted', { to: from, answer })

    }, [socket])

    const handleCallAccepted = useCallback(({ from, answer }) => {

        peer.setLocalDescription(answer)
        for (const track of myStream.getStracks()){
            peer.peer.addTrack(track, myStream)
        }
        console.log('call accepted')

    }, [myStream])

    useEffect(() => {


        socket.on('user:joined', handleUserJoined)
        socket.on('incoming:call', handleIncomingCall)
        socket.on('call:accepted', handleCallAccepted)


    
        return () => {
            socket.off('user:joined', handleUserJoined)
            socket.off('incoming:call', handleIncomingCall)
            socket.off('call:accepted', handleCallAccepted)

        }

    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted])

    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? 'connected' : 'no one in room'}</h4>
            {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
            {myStream && <ReactPlayer
                playing
                muted
                width="300px"
                height="300px"
                url={myStream} />}
        </div>
    )
}

export default RoomPage