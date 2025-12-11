import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <img 
        src="/cinesync-logo.svg" 
        alt="CineSync Logo" 
        className="h-32 w-32 mb-8 opacity-50"
      />
      <h1 className="text-6xl font-bold text-papaya mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page not found</p>
      <Link 
        to="/" 
        className="bg-papaya text-black px-6 py-3 rounded-lg font-bold hover:bg-papaya-dark transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
