import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  X, Upload, Image as ImageIcon,
  Package, Tag, DollarSign, Hash, FileText, Star
} from 'lucide-react';
import { SWEET_CATEGORIES, FORM_LIMITS } from '../../utils/constants';
import { getCategoryInfo } from '../../utils/helpers';

// Validation schema
const sweetSchema = yup.object().shape({
  name: yup
    .string()
    .required('Sweet name is required')
    .min(FORM_LIMITS.NAME_MIN, `Name must be at least ${FORM_LIMITS.NAME_MIN} characters`)
    .max(FORM_LIMITS.NAME_MAX, `Name cannot exceed ${FORM_LIMITS.NAME_MAX} characters`),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(SWEET_CATEGORIES.map(cat => cat.value), 'Please select a valid category'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be positive')
    .min(FORM_LIMITS.PRICE_MIN, `Price must be at least ${FORM_LIMITS.PRICE_MIN}`)
    .max(FORM_LIMITS.PRICE_MAX, `Price cannot exceed ${FORM_LIMITS.PRICE_MAX}`),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(FORM_LIMITS.QUANTITY_MIN, `Quantity cannot be negative`)
    .max(FORM_LIMITS.QUANTITY_MAX, `Quantity cannot exceed ${FORM_LIMITS.QUANTITY_MAX}`),
  description: yup
    .string()
    .max(FORM_LIMITS.DESCRIPTION_MAX, `Description cannot exceed ${FORM_LIMITS.DESCRIPTION_MAX} characters`),
  calories: yup
    .number()
    .typeError('Calories must be a number')
    .positive('Calories must be positive')
    .nullable(),
  is_featured: yup.boolean().default(false),
});

const SweetForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(sweetSchema),
    defaultValues: initialData || {
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
      calories: '',
      is_featured: false,
    },
  });

  const categoryValue = watch('category');
  const isFeatured = watch('is_featured');

  // Set initial data
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData, reset]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setValue('image', null);
  };

  // Handle form submission
  const handleFormSubmit = (data) => {
    const formData = new FormData();
    
    // Append form data
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });
    
    // Append image file if exists
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    onSubmit(formData);
  };

  const categoryInfo = getCategoryInfo(categoryValue);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sweet-primary to-sweet-accent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
                </h2>
                <p className="text-white/80">
                  {isEditing ? 'Update sweet details' : 'Add a new sweet to your shop'}
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                type="button"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-semibold text-sweet-dark mb-2">
                  <Tag size={16} className="mr-2" />
                  Sweet Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-sweet-light focus:border-sweet-primary focus:ring-sweet-primary/20'} bg-white outline-none transition-all duration-200`}
                    placeholder="e.g., Chocolate Truffle"
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/60">
                    <Tag size={18} />
                  </div>
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-semibold text-sweet-dark mb-2">
                  <Package size={16} className="mr-2" />
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SWEET_CATEGORIES.map((category) => {
                    const isSelected = categoryValue === category.value;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setValue('category', category.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center ${isSelected ? 'border-sweet-primary bg-sweet-primary/5' : 'border-sweet-light hover:border-sweet-primary/30'}`}
                        disabled={isLoading}
                      >
                        <span className="text-2xl mb-1">{category.icon}</span>
                        <span className={`text-sm font-medium ${isSelected ? 'text-sweet-primary' : 'text-sweet-dark'}`}>
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {categoryValue && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                    <span className="text-sm text-sweet-dark/70">
                      Selected: {categoryInfo.label}
                    </span>
                  </div>
                )}
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-semibold text-sweet-dark mb-2">
                    <DollarSign size={16} className="mr-2" />
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      {...register('price')}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-sweet-light focus:border-sweet-primary focus:ring-sweet-primary/20'} bg-white outline-none transition-all duration-200`}
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/60">
                      <DollarSign size={18} />
                    </div>
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-sweet-dark mb-2">
                    <Hash size={16} className="mr-2" />
                    Quantity *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register('quantity')}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.quantity ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-sweet-light focus:border-sweet-primary focus:ring-sweet-primary/20'} bg-white outline-none transition-all duration-200`}
                      placeholder="0"
                      disabled={isLoading}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/60">
                      <Hash size={18} />
                    </div>
                  </div>
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                  )}
                </div>
              </div>

              {/* Calories */}
              <div>
                <label className="text-sm font-semibold text-sweet-dark mb-2 block">
                  Calories (Optional)
                </label>
                <input
                  type="number"
                  {...register('calories')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.calories ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-sweet-light focus:border-sweet-primary focus:ring-sweet-primary/20'} bg-white outline-none transition-all duration-200`}
                  placeholder="e.g., 250"
                  disabled={isLoading}
                />
                {errors.calories && (
                  <p className="mt-1 text-sm text-red-600">{errors.calories.message}</p>
                )}
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 bg-sweet-light/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isFeatured ? 'bg-sweet-accent/20' : 'bg-sweet-dark/10'}`}>
                    <Star className={isFeatured ? 'text-sweet-accent' : 'text-sweet-dark/60'} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sweet-dark">Featured Sweet</p>
                    <p className="text-sm text-sweet-dark/70">
                      Show this sweet on homepage
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-sweet-dark/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sweet-accent"></div>
                </label>
              </div>
            </div>

            {/* Right Column - Image & Description */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="flex items-center text-sm font-semibold text-sweet-dark mb-2">
                  <ImageIcon size={16} className="mr-2" />
                  Sweet Image
                </label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-sweet-light"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      disabled={isLoading}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-sweet-light rounded-lg cursor-pointer bg-sweet-light/30 hover:bg-sweet-light/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-sweet-dark/40 mb-4" />
                      <p className="mb-2 text-sm text-sweet-dark">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-sweet-dark/60">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-semibold text-sweet-dark mb-2">
                  <FileText size={16} className="mr-2" />
                  Description (Optional)
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-sweet-light focus:border-sweet-primary focus:ring-sweet-primary/20'} bg-white outline-none transition-all duration-200 resize-none`}
                  placeholder="Describe your sweet... (taste, ingredients, etc.)"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
                <p className="mt-1 text-xs text-sweet-dark/60">
                  {watch('description')?.length || 0} / {FORM_LIMITS.DESCRIPTION_MAX} characters
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-sweet-light flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border-2 border-sweet-light text-sweet-dark font-semibold rounded-lg hover:bg-sweet-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-sweet-primary to-sweet-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditing ? 'Update Sweet' : 'Add Sweet'}
                  <Package size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SweetForm;