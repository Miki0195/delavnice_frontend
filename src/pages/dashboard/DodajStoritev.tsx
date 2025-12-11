import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Upload, Plus, X, Info, FileText, Image as ImageIcon, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/ui/Button';
import {
  createWorkshop,
  updateWorkshop,
  addService,
  addSlot,
  getActivityTypes,
  getFeatures,
  getWorkshopById,
  type WorkshopFormData,
  type ServiceFormData,
  type SlotFormData,
} from '../../api/workshops';
import { CATEGORIES, REGIONS, EXECUTION_LOCATIONS } from '../../constants/workshopOptions';
import { getProfile } from '../../api/profile';

interface ServiceForm extends ServiceFormData {
  tempId: string;
  isVisible: boolean;
}

interface SlotForm extends SlotFormData {
  tempId: string;
}

interface GalleryImage {
  id: string;
  file: File;
  preview: string;
  isFeatured: boolean;
}

const DodajStoritev = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<WorkshopFormData>({
    kind: 'SERVICE',
    title: '',
    subtitle: '',
    category: '',
    target_group: '',
    program_duration: '',
    description: '',
    region: '',
    address: '',
    activity_types_ids: [],
    features_ids: [],
    is_published: false, // Will be set to false by backend, requires admin approval
  });
  
  const [services, setServices] = useState<ServiceForm[]>([]);
  const [slots, setSlots] = useState<SlotForm[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [executionLocation, setExecutionLocation] = useState('');
  
  // Contact info from profile
  const [contactInfo, setContactInfo] = useState({
    website: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    whatsapp: '',
    skype: '',
  });
  const [videoUrl, setVideoUrl] = useState('');
  
  // Fetch profile data to auto-fill contact info
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Fetch existing workshop data if editing
  const { data: existingWorkshop, isLoading: isLoadingWorkshop } = useQuery({
    queryKey: ['workshop', id],
    queryFn: () => getWorkshopById(Number(id)),
    enabled: isEditMode,
  });
  
  // Load existing workshop data into form
  useEffect(() => {
    if (existingWorkshop && isEditMode) {
      setFormData({
        kind: existingWorkshop.kind,
        title: existingWorkshop.title,
        subtitle: existingWorkshop.subtitle || '',
        category: existingWorkshop.category,
        target_group: existingWorkshop.target_group,
        program_duration: existingWorkshop.program_duration,
        description: existingWorkshop.description,
        region: existingWorkshop.region,
        address: existingWorkshop.address || '',
        activity_types_ids: existingWorkshop.activity_types.map(at => at.id),
        features_ids: existingWorkshop.features.map(f => f.id),
        is_published: existingWorkshop.is_published,
      });

      // Load existing services
      if (existingWorkshop.services) {
        setServices(existingWorkshop.services.map((s, idx) => ({
          name: s.name,
          description: s.description,
          sessions_count: s.sessions_count,
          session_duration_minutes: s.session_duration_minutes,
          price_eur: Number(s.price_eur),
          is_free: s.is_free,
          tempId: `service-${idx}`,
          isVisible: true,
        })));
      }

      // Load existing slots
      if (existingWorkshop.available_slots) {
        setSlots(existingWorkshop.available_slots.map((s, idx) => ({
          start_datetime: s.start_datetime,
          end_datetime: s.end_datetime,
          capacity: s.capacity,
          tempId: `slot-${idx}`,
        })));
      }

      // Load existing image (if any)
      if (existingWorkshop.image) {
        // Note: We can't pre-load the actual File object, but we can show the URL
        // The form will keep the existing image unless a new one is uploaded
      }
    }
  }, [existingWorkshop, isEditMode]);
  
  useEffect(() => {
    if (profile) {
      const providerProfile = profile.provider_profile || profile.school_profile;
      if (providerProfile) {
        setContactInfo({
          website: providerProfile.website_url || '',
          phone: providerProfile.phone_number || '',
          email: profile.email || '',
          facebook: providerProfile.facebook_url || '',
          instagram: providerProfile.instagram_url || '',
          twitter: providerProfile.twitter_url || '',
          youtube: providerProfile.youtube_url || '',
          whatsapp: providerProfile.whatsapp_number || '',
          skype: providerProfile.skype_username || '',
        });
      }
    }
  }, [profile]);
  
  // Fetch activity types and features
  const { data: activityTypes = [], isLoading: isLoadingActivityTypes } = useQuery({
    queryKey: ['activity-types'],
    queryFn: getActivityTypes,
  });
  
  const { data: features = [], isLoading: isLoadingFeatures } = useQuery({
    queryKey: ['features'],
    queryFn: getFeatures,
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleMultiSelect = (name: string, value: number) => {
    setFormData((prev) => {
      const currentArray = prev[name as keyof WorkshopFormData] as number[] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };
  
  // Gallery management
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages: GalleryImage[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        isFeatured: galleryImages.length === 0, // First image is featured by default
      }));
      setGalleryImages((prev) => [...prev, ...newImages]);
    }
  };
  
  const setFeaturedImage = (id: string) => {
    setGalleryImages((prev) =>
      prev.map((img) => ({ ...img, isFeatured: img.id === id }))
    );
  };
  
  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // If removed image was featured, make first image featured
      if (filtered.length > 0 && !filtered.some((img) => img.isFeatured)) {
        filtered[0].isFeatured = true;
      }
      return filtered;
    });
  };
  
  const moveImage = (id: string, direction: 'left' | 'right') => {
    setGalleryImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index === -1) return prev;
      
      const newArray = [...prev];
      if (direction === 'left' && index > 0) {
        [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
      } else if (direction === 'right' && index < newArray.length - 1) {
        [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      }
      return newArray;
    });
  };
  
  // Service management
  const addServiceRow = () => {
    setServices((prev) => [
      ...prev,
      {
        tempId: Date.now().toString(),
        name: '',
        description: '',
        sessions_count: 1,
        session_duration_minutes: 60,
        price_eur: 0,
        is_free: false,
        isVisible: true,
      },
    ]);
  };
  
  const updateService = (tempId: string, field: keyof ServiceForm, value: any) => {
    setServices((prev) =>
      prev.map((s) => (s.tempId === tempId ? { ...s, [field]: value } : s))
    );
  };
  
  const removeService = (tempId: string) => {
    setServices((prev) => prev.filter((s) => s.tempId !== tempId));
  };
  
  // Slot management
  const addSlotRow = () => {
    setSlots((prev) => [
      ...prev,
      {
        tempId: Date.now().toString(),
        start_datetime: '',
        end_datetime: '',
        capacity: 20,
      },
    ]);
  };
  
  const updateSlot = (tempId: string, field: keyof SlotForm, value: any) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.tempId === tempId ? { ...slot, [field]: value } : slot))
    );
  };
  
  const removeSlot = (tempId: string) => {
    setSlots((prev) => prev.filter((slot) => slot.tempId !== tempId));
  };
  
  const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (wordCount > 150) {
      alert('Opis ne sme presegati 150 besed.');
      return;
    }
    if (formData.target_group.length > 50) {
      alert('Ciljna skupina ne sme presegati 50 znakov.');
      return;
    }
    if (formData.program_duration.length > 100) {
      alert('Trajanje programa ne sme presegati 100 znakov.');
      return;
    }
    if (services.length === 0) {
      alert('Dodajte vsaj eno storitev.');
      return;
    }
    
    // Get featured image
    const featuredImage = galleryImages.find((img) => img.isFeatured);
    
    const submitData: WorkshopFormData = {
      ...formData,
      image: featuredImage?.file || undefined,
    };
    
    if (isEditMode) {
      updateMutation.mutate({ id: Number(id), data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createWorkshop,
    onSuccess: async (workshop) => {
      // Add services
      for (const service of services) {
        await addService(workshop.id, {
          name: service.name,
          description: service.description,
          sessions_count: service.sessions_count,
          session_duration_minutes: service.session_duration_minutes,
          price_eur: service.price_eur,
          is_free: service.is_free,
        });
      }
      
      // Add slots
      for (const slot of slots) {
        await addSlot(workshop.id, {
          start_datetime: slot.start_datetime,
          end_datetime: slot.end_datetime,
          capacity: slot.capacity,
        });
      }
      
      alert('Storitev uspešno oddana! Vaša delavnica čaka na odobritev administratorja.');
      navigate('/dashboard/delavnice?status=in_review');
    },
    onError: (error: any) => {
      alert(`Napaka: ${error.response?.data?.detail || error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkshopFormData }) => updateWorkshop(id, data),
    onSuccess: async () => {
      // TODO: Handle updating services and slots
      // For now, we'll just update the workshop itself
      alert('Spremembe uspešno oddane! Vaša delavnica čaka na ponovno odobritev administratorja.');
      navigate('/dashboard/delavnice?status=in_review');
    },
    onError: (error: any) => {
      alert(`Napaka: ${error.response?.data?.detail || error.message}`);
    },
  });
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary transition-colors"
            >
              Domov
            </button>
            <span className="mx-2">›</span>
            <button
              onClick={() => navigate('/dashboard/dodaj-delavnico')}
              className="hover:text-primary transition-colors"
            >
              Nadzorna plošča
            </button>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Dodaj storitev</span>
          </div>

          <button
            onClick={() => navigate('/dashboard/dodaj-delavnico')}
            className="flex items-center text-primary hover:text-primary-dark mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Nazaj na izbiro vrste
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Uredi storitev' : 'Dodaj storitev'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Osnovne informacije Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Osnovne informacije</h2>
            </div>

            <div className="space-y-6">
              {/* Naslov storitve */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Naslov storitve
                </label>
                <span className="text-gray-500 text-xs">0/40 znakov</span>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={40}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary mt-1"
                  required
                />
              </div>

              {/* Podnaslov storitve */}
              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Podnaslov storitve
                </label>
                <span className="text-gray-500 text-xs">0/100 znakov</span>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Podnaslov delavnice"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary mt-1"
                />
              </div>

              {/* Kategorija, Vrsta aktivnosti, Lastnosti */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kategorija */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategorija
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary mt-1"
                    required
                  >
                    <option value="">IzberiKategorija</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vrsta aktivnosti */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vrsta aktivnosti
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto mt-1">
                    {isLoadingActivityTypes ? (
                      <p className="text-sm text-gray-500">Nalaganje...</p>
                    ) : activityTypes && activityTypes.length > 0 ? (
                      activityTypes.map((type) => (
                      <label key={type.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={formData.activity_types_ids?.includes(type.id)}
                          onChange={() => handleMultiSelect('activity_types_ids', type.id)}
                          className="mr-2"
                        />
                        <span className="text-sm">{type.name}</span>
                      </label>
                    ))
                    ) : (
                      <p className="text-sm text-gray-500">Ni podatkov</p>
                    )}
                  </div>
                </div>

                {/* Lastnosti */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lastnosti
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto mt-1">
                    {isLoadingFeatures ? (
                      <p className="text-sm text-gray-500">Nalaganje...</p>
                    ) : features && features.length > 0 ? (
                      features.map((feature) => (
                      <label key={feature.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={formData.features_ids?.includes(feature.id)}
                          onChange={() => handleMultiSelect('features_ids', feature.id)}
                          className="mr-2"
                        />
                        <span className="text-sm">{feature.name}</span>
                      </label>
                    ))
                    ) : (
                      <p className="text-sm text-gray-500">Ni podatkov</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ključne besede */}
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                  Ključne besede
                </label>
                <input
                  type="text"
                  id="keywords"
                  placeholder="Vpišite ključne besede, ločene z vejico"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Regija */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                  Regija
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Izberi Regijo</option>
                  {REGIONS.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Naslov <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Npr. Slovenska cesta 1, Ljubljana"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vnesite polni naslov lokacije, kjer bo delavnica potekala.
                </p>
              </div>
            </div>
          </div>

          {/* Podrobnosti Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Podrobnosti</h2>
            </div>

            <div className="space-y-6">
              {/* Ciljna skupina */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="target_group" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciljna skupina
                  </label>
                  <span className="text-gray-500 text-xs">
                    {formData.target_group.length}/50 znakov
                  </span>
                  <input
                    type="text"
                    id="target_group"
                    name="target_group"
                    value={formData.target_group}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder="Ciljna skupina (starostni razpon)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary mt-1"
                    required
                  />
                </div>

                {/* Trajanje 1 izvedbe */}
                <div>
                  <label htmlFor="program_duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Trajanje 1 izvedbe
                  </label>
                  <span className="text-gray-500 text-xs">
                    {formData.program_duration.length}/100 znakov
                  </span>
                  <input
                    type="text"
                    id="program_duration"
                    name="program_duration"
                    value={formData.program_duration}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Trajanje programa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary mt-1"
                    required
                  />
                </div>
              </div>

              {/* Opis */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Opis storitve z nameni in cilji programa
                </label>
                <span className="text-gray-500 text-xs">
                  {wordCount}/150 besed
                </span>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary mt-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cene in storitve Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Cene in storitve, ki jih je mogoče rezervirati</h2>
            </div>

            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.tempId} className="border border-gray-200 rounded-lg p-4 relative">
                  <button
                    type="button"
                    onClick={() => removeService(service.tempId)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Service title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Naslov storitve
                      </label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.tempId, 'name', e.target.value)}
                        placeholder="Service title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opis
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(service.tempId, 'description', e.target.value)}
                        placeholder="Opis"
                        rows={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    {/* Number of sessions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Število srečanj
                      </label>
                      <input
                        type="number"
                        value={service.sessions_count}
                        onChange={(e) => updateService(service.tempId, 'sessions_count', parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    {/* Duration (e.g. 60 minutes) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trajanje (min)
                      </label>
                      <input
                        type="number"
                        value={service.session_duration_minutes}
                        onChange={(e) => updateService(service.tempId, 'session_duration_minutes', parseInt(e.target.value) || 60)}
                        min="1"
                        placeholder="Trajanje"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cena (€)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={service.price_eur}
                          onChange={(e) => updateService(service.tempId, 'price_eur', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          disabled={service.is_free}
                          placeholder="Cena"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                          required={!service.is_free}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Free checkbox and Visible toggle */}
                  <div className="flex items-center gap-6 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={service.is_free}
                        onChange={(e) => {
                          updateService(service.tempId, 'is_free', e.target.checked);
                          if (e.target.checked) {
                            updateService(service.tempId, 'price_eur', 0);
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">Brezplačna delavnica</span>
                    </label>

                    <label className="flex items-center">
                      <span className="text-sm mr-2">Prikaži</span>
                      <div
                        onClick={() => updateService(service.tempId, 'isVisible', !service.isVisible)}
                        className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                          service.isVisible ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            service.isVisible ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addServiceRow}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj storitev
              </Button>

              <p className="text-sm text-gray-600 mt-4">
                Cena vključuje 15 % provizije.
              </p>
            </div>
          </div>

          {/* Galerija Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Galerija</h2>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                By selecting (clicking on a photo) one of the uploaded photos you will set it as Featured Image for this listing (marked by icon with star). 
                Drag and drop thumbnails to re-order images in gallery.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              {galleryImages.length === 0 ? (
                <label htmlFor="gallery-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Plus className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">Kliknite tukaj ali spustite datoteke za nalaganje.</p>
                  <input
                    type="file"
                    id="gallery-upload"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {galleryImages.map((img) => {
                      const imgIndex = galleryImages.indexOf(img);
                      return (
                      <div
                        key={img.id}
                        className={`relative group border-2 rounded-lg overflow-hidden ${
                          img.isFeatured ? 'border-yellow-400' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={img.preview}
                          alt={`Gallery ${imgIndex + 1}`}
                          className="w-full h-32 object-cover cursor-pointer"
                          onClick={() => setFeaturedImage(img.id)}
                        />
                        {img.isFeatured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 rounded text-xs">
                            ⭐ Featured
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {imgIndex > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(img.id, 'left')}
                              className="bg-white p-1 rounded shadow hover:bg-gray-100"
                            >
                              ←
                            </button>
                          )}
                          {imgIndex < galleryImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(img.id, 'right')}
                              className="bg-white p-1 rounded shadow hover:bg-gray-100"
                            >
                              →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(img.id)}
                            className="bg-red-500 text-white p-1 rounded shadow hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                  <label htmlFor="gallery-upload-more">
                    <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('gallery-upload-more')?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Dodaj več slik
                    </Button>
                    <input
                      type="file"
                      id="gallery-upload-more"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Izvedba na vaši ustanovi + Contact Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Kontakt in lokacija</h2>
            </div>

            {/* Execution Location */}
            <div className="mb-6">
              <label htmlFor="execution_location" className="block text-sm font-medium text-gray-700 mb-1">
                Izvedba na vaši ustanovi
              </label>
              <select
                id="execution_location"
                value={executionLocation}
                onChange={(e) => setExecutionLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Izvedba na vaši ustanovi</option>
                {EXECUTION_LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Information (auto-filled) */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spletna stran
                  </label>
                  <input
                    type="url"
                    value={contactInfo.website}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefonska številka
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-pošta
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {/* Social media (auto-filled) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={contactInfo.facebook}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={contactInfo.twitter}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={contactInfo.instagram}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={contactInfo.whatsapp}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={contactInfo.youtube}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skype
                  </label>
                  <input
                    type="text"
                    value={contactInfo.skype}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {/* Video */}
              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Video
                </label>
                <input
                  type="url"
                  id="video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="URL to oEmbed supported service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Možni termini izvedbe (Slots) Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Možni termini izvedbe</h2>
            </div>

            <div className="space-y-4">
              {slots.map((slot) => (
                <div key={slot.tempId} className="border border-gray-200 rounded-lg p-4 relative">
                  <button
                    type="button"
                    onClick={() => removeSlot(slot.tempId)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Začetek
                      </label>
                      <input
                        type="datetime-local"
                        value={slot.start_datetime}
                        onChange={(e) => updateSlot(slot.tempId, 'start_datetime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Konec
                      </label>
                      <input
                        type="datetime-local"
                        value={slot.end_datetime}
                        onChange={(e) => updateSlot(slot.tempId, 'end_datetime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kapaciteta
                      </label>
                      <input
                        type="number"
                        value={slot.capacity}
                        onChange={(e) => updateSlot(slot.tempId, 'capacity', parseInt(e.target.value) || 20)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSlotRow}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj termin
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/dodaj-delavnico')}
            >
              Prekliči
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Shranjujem...' : 'Predogled'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DodajStoritev;
