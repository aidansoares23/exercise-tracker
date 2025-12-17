import { NavLink } from 'react-router-dom';

function Navigation () {
    return (
        <nav className='App-nav'>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/add-exercise">Add</NavLink>
        </nav>
    )
}

export default Navigation;