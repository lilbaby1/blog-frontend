import { useEffect, useRef, useState } from 'react'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'


const UsersList = () => {
    const [users, setUsers] = useState([])
    const { auth } = useAuth()

    const effectRan = useRef(false)

    useEffect(() => {

        const getUsers = async () => {
            try {
                const response = await axios.get('/users', {
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${auth.accessToken}`
                    },
                    withCredentials: true
                })
                setUsers(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        if (effectRan.current){
            getUsers();
        }

        return () => {
            effectRan.current = true
        }
    }, [])
    
  return (
    <section>
        {users ? (
            <ul>
                {users.map((user, i) => <li key={i}>{user.username}</li>)}
            </ul>
        ) : (<p>Users not found.</p>)}
    </section>
  )
}

export default UsersList