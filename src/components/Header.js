import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useLogout from '../hooks/useLogout'

const Header = () => {
  const { auth } = useAuth()
  const logout = useLogout()
  const [drop, setDrop] = useState(false)
  const [closeIcon, setCloseIcon] = useState(false)

  const signOut = async () => {
    await logout()
  }

  const onIconOrNavClicked = () => {
    setDrop(prev => !prev)
    setCloseIcon(prev => !prev)
  }

  return (
    <header>
        <section className='header-title-line'>
          <h1>BlogSpace</h1>
          <button 
            className="menu-button"
            onClick={onIconOrNavClicked}
          >
              <div className={closeIcon ? 'close-icon' : "menu-icon"}></div>
          </button>
        </section>
        
        <nav 
          className={drop ? 'dropdown' : ''}
          onClick={drop ? onIconOrNavClicked : null}
        >
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/post/new'>Post</Link></li>
                {
                  auth?.user 
                    ? <li onClick={signOut}><Link to='logout'>Logout</Link></li>
                    : <li><Link to='login'>Login</Link></li>
                }
            </ul>
        </nav>
    </header>
  )
}

export default Header