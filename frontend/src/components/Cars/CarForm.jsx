import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carService } from '../../services/api';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const CarForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    car_type: '',
    company: '',
    dealer: '',
    tags: [],
    images: []
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchCar();
    }
  }, [mode, id]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const car = await carService.getCarById(id);
      if (car) {
        setFormData({
          title: car.title || '',
          description: car.description || '',
          car_type: car.car_type || '',
          company: car.company || '',
          dealer: car.dealer || '',
          tags: car.tags || [],
          images: car.images || []
        });
      } else {
        setError('Car not found');
        navigate('/');
      }
    } catch (err) {
      console.error('Error fetching car:', err);
      setError('Failed to fetch car details');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanFormData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        images: formData.images
          .filter(url => url.trim() !== '')
          .map(url => url.trim())
      };

      const invalidUrls = cleanFormData.images.filter(url => !isValidUrl(url));
      if (invalidUrls.length > 0) {
        toast.error('Please enter valid URLs for images');
        setError('Invalid image URLs detected');
        setLoading(false);
        return;
      }

      if (mode === 'edit') {
        await carService.updateCar(id, cleanFormData);
        toast.success('Car updated successfully');
      } else {
        await carService.createCar(cleanFormData);
        toast.success('Car created successfully');
      }
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.detail || `Failed to ${mode} car`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(tag => tag.trim())
      }));
    } else if (name === 'images') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(url => url.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white 
                       rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit Car' : 'Add New Car'}
            </h1>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 
                          px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Car Type</label>
              <input
                type="text"
                name="car_type"
                value={formData.car_type}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dealer</label>
              <input
                type="text"
                name="dealer"
                value={formData.dealer}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image URLs (comma-separated)
              </label>
              <input
                type="text"
                name="images"
                value={formData.images.join(', ')}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                         hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                         border border-transparent rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                         dark:focus:ring-offset-gray-900"
              >
                {mode === 'edit' ? 'Save Changes' : 'Create Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarForm; 