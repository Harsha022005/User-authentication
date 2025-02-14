import {Link} from 'react-router-dom';

function Navbar(){
    return (
        <div>
             <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">AuthApp</h1>
        <div>
          <Link to="/signup" className="px-4 py-2 bg-white text-blue-600 rounded-lg mr-2">Signup</Link>
          <Link to="/login" className="px-4 py-2 bg-white text-blue-600 rounded-lg">Login</Link>
        </div>
      </div>
    </nav>
        </div>
    )
}
export default Navbar