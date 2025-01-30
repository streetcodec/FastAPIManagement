import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService } from '../../services/api';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CarDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const data = await carService.getCarById(id);
      setCar(data);
    } catch (err) {
      toast.error('Failed to fetch car details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                   dark:hover:text-gray-200"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Image Gallery */}
        <div className="relative h-96">
          {car.images && car.images.length > 0 ? (
            <>
              <img
                src={car.images[currentImage]}
                alt={car.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
              {car.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 
                             text-white hover:bg-black/75"
                  >
                    <FaChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 
                             text-white hover:bg-black/75"
                  >
                    <FaChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {car.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentImage === idx ? 'bg-white scale-110' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">No images available</span>
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{car.title}</h1>
            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 
                         dark:text-indigo-200 rounded-full">
              {car.car_type}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{car.description}</p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Company</h2>
              <p className="text-gray-600 dark:text-gray-300">{car.company}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dealer</h2>
              <p className="text-gray-600 dark:text-gray-300">{car.dealer}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {car.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 
                           dark:text-blue-200 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailView; 