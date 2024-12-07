import { NavLink } from 'react-router-dom';
import recipemasterLogo from './logo.jpg';

const Navbar = () => {
  return (
    <header>
      <div 
        className="container" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <NavLink 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            marginBottom: '20px',
          }}
        >
          <img 
            src={recipemasterLogo} 
            alt="Recipe Master Logo" 
            style={{ width: '150px', height: '150px', marginRight: '20px' }} 
          />
          <h1 style={{ color: '#333', fontSize: '2rem' }}>Recipe Master</h1>
        </NavLink>

        <nav>
          <ul 
            style={{
              listStyleType: 'none',
              display: 'flex',
              gap: '20px',
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <NavLink 
                to="/" 
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: '#555',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  padding: '8px 12px',
                  border: isActive ? '2px solid black' : 'none',
                  borderRadius: '5px',
                })}
              >
                Browse Recipes
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/report" 
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: '#555',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  padding: '8px 12px',
                  border: isActive ? '2px solid black' : 'none', 
                  borderRadius: '5px',
                })}
              >
                Generate Reports
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
