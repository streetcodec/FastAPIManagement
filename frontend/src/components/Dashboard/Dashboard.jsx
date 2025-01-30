import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../../services/api';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await carService.getAllCars(searchTerm);
      setCars(data);
    } catch (err) {
      setError('Failed to fetch cars');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    try {
      if (window.confirm('Are you sure you want to delete this car?')) {
        setLoading(true);
        await carService.deleteCar(carId);
        toast.success('Car deleted successfully');
        await fetchCars(); // Refresh the list
      }
    } catch (err) {
      console.error('Error deleting car:', err);
      toast.error('Failed to delete car');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Debounce search
    setTimeout(() => {
      fetchCars();
    }, 500);
  };

  const ImageGallery = ({ images }) => {
    const [currentImage, setCurrentImage] = useState(0);

    if (!images || images.length === 0) return null;

    const nextSlide = () => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
      setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Auto-advance slides every 5 seconds
    useEffect(() => {
      if (images.length <= 1) return;
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }, [images.length]);

    return (
      <div className="relative group h-48 overflow-hidden">
        {/* Image slider */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ 
            transform: `translateX(-${currentImage * 100}%)`,
            width: `${images.length * 100}%`
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Car view ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {index + 1}/{images.length}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 
                       text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       hover:bg-black/75"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 
                       text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       hover:bg-black/75"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Navigation dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full ${
                  currentImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Add New Car */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search cars..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => navigate('/cars/new')}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Add New Car
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 
                      px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} 
               className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                        transform hover:scale-[1.02] transition-all duration-200">
            <ImageGallery images={car.images} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{car.title}</h2>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 
                               dark:text-indigo-200 rounded-full text-sm">
                  {car.car_type}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{car.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 
                             dark:text-blue-200 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{car.company}</span>
                <span>{car.dealer}</span>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => navigate(`/cars/${car.id}`)}
                  className="flex items-center px-3 py-1 text-green-500 hover:text-green-700 
                           dark:text-green-400 dark:hover:text-green-300"
                >
                  <FaEye className="mr-1" />
                  View
                </button>
                <button
                  onClick={() => navigate(`/cars/${car.id}/edit`)}
                  className="flex items-center px-3 py-1 text-blue-500 hover:text-blue-700 
                           dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FaEdit className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="flex items-center px-3 py-1 text-red-500 hover:text-red-700 
                           dark:text-red-400 dark:hover:text-red-300"
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cars.length === 0 && !loading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No cars found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by adding a new car.</p>
          <button
            onClick={() => navigate('/cars/new')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Add New Car
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;