import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSocket } from '../context/SocketProvider';

const LobbyScreen = () => {

    const [email, setEmail] = useState('')
    const [room, setRoom] = useState('')

    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(e => {
        e.preventDefault();
        socket.emit('room:join', { email, room })
    }, [email, socket, room])

    const handleJoinRoom = useCallback((data) => {
        const { email, room } = data;
        navigate(`/room/${room}`);

    }, [navigate])

    useEffect(() => {
        socket.on('room:join', handleJoinRoom)

        return () => { socket.off('room:join') }

    }, [socket, handleJoinRoom])
    return (
        <div>
            <h1>Lobby</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor='email'>Email </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <br />
                <label htmlFor='room'>Room No </label>
                <input
                    id="room"
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                />
                <br />
                <button>Join</button>
            </form>
        </div>
    )
}

export default LobbyScreen