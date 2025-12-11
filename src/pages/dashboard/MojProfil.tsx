import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { getProfile, updateProfile, type ProfileData } from '../../api/profile';
import { useAuth } from '../../context/AuthContext';
import { Upload } from 'lucide-react';
import Button from '../../components/ui/Button';

const MojProfil = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [publicInterestFile, setPublicInterestFile] = useState<File | null>(null);
  const [cleanRecordFile, setCleanRecordFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profileData && user) {
      setFormData({
        ...profileData,
        contact_email: user.email, // Set from user's registration email
      });
      // Set profile picture preview if exists
      if (profileData.profile_picture) {
        setProfilePicturePreview(profileData.profile_picture);
      }
    }
  }, [profileData, user]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      setSuccessMessage('Profil uspešno posodobljen!');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccessMessage(''), 3000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'public_interest' | 'clean_record') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'public_interest') {
        setPublicInterestFile(file);
      } else {
        setCleanRecordFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit: any = {
      ...formData,
    };

    if (profilePictureFile) {
      dataToSubmit.profile_picture_file = profilePictureFile;
    }
    if (publicInterestFile) {
      dataToSubmit.public_interest_certificate_file = publicInterestFile;
    }
    if (cleanRecordFile) {
      dataToSubmit.clean_record_certificates_file = cleanRecordFile;
    }

    updateMutation.mutate(dataToSubmit);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Nalaganje profila...</div>
      </DashboardLayout>
    );
  }

  const isProvider = user?.role === 'PROVIDER';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Podatki o organizaciji */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Podatki o organizaciji</h2>
            
            <div className="space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100">
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Naloži sliko profila</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    id="profile-picture"
                  />
                  <label
                    htmlFor="profile-picture"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {profilePictureFile ? profilePictureFile.name : 'Izberi sliko'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG ali JPEG (maks. 5MB)
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Naziv organizacije
                </label>
                <input
                  type="text"
                  id="organization_name"
                  name="organization_name"
                  value={formData.organization_name || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="about_us" className="block text-sm font-medium text-gray-700 mb-1">
                  O nas
                </label>
                <textarea
                  id="about_us"
                  name="about_us"
                  value={formData.about_us || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Kratek opis vaše organizacije..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              {isProvider && (
                <div>
                  <label htmlFor="tax_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Davčna številka
                  </label>
                  <input
                    type="text"
                    id="tax_number"
                    name="tax_number"
                    value={formData.tax_number || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefonska številka
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Podatki o kontaktni osebi */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Podatki o kontaktni osebi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ime
                </label>
                <input
                  type="text"
                  id="contact_first_name"
                  name="contact_first_name"
                  value={formData.contact_first_name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="contact_last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Priimek
                </label>
                <input
                  type="text"
                  id="contact_last_name"
                  name="contact_last_name"
                  value={formData.contact_last_name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  To je email naslov, s katerim ste registrirali račun.
                </p>
              </div>

              <div>
                <label htmlFor="contact_position" className="block text-sm font-medium text-gray-700 mb-1">
                  Pozicija
                </label>
                <input
                  type="text"
                  id="contact_position"
                  name="contact_position"
                  value={formData.contact_position || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefonska številka
                </label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Certificates - Only for Providers */}
          {isProvider && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Potrdila</h2>
              
              <div className="space-y-6">
                {/* Public Interest Certificate */}
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="has_public_interest_certificate"
                      name="has_public_interest_certificate"
                      checked={formData.has_public_interest_certificate || false}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="has_public_interest_certificate" className="text-sm font-medium text-gray-700">
                      Imam potrdilo o javnem interesu
                    </label>
                  </div>
                  
                  <label className="block">
                    <span className="block text-sm text-gray-600 mb-2">
                      Dodaj potrdilo o javnem interesu
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'public_interest')}
                        className="hidden"
                        id="public-interest-file"
                      />
                      <label
                        htmlFor="public-interest-file"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {publicInterestFile ? publicInterestFile.name : 'Izberi datoteko'}
                      </label>
                    </div>
                  </label>
                </div>

                {/* Clean Record Certificates */}
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="has_clean_record_certificates"
                      name="has_clean_record_certificates"
                      checked={formData.has_clean_record_certificates || false}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="has_clean_record_certificates" className="text-sm font-medium text-gray-700">
                      Imam potrdila o nekaznovanosti
                    </label>
                  </div>
                  
                  <label className="block">
                    <span className="block text-sm text-gray-600 mb-2">
                      Dodaj potrdila o nekaznovanosti za izvajalce (v zip datoteki)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".zip"
                        onChange={(e) => handleFileChange(e, 'clean_record')}
                        className="hidden"
                        id="clean-record-file"
                      />
                      <label
                        htmlFor="clean-record-file"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {cleanRecordFile ? cleanRecordFile.name : 'Izberi ZIP datoteko'}
                      </label>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Komunikacijski kanali (Social) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Komunikacijski kanali</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter_url"
                  name="twitter_url"
                  value={formData.twitter_url || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook_url"
                  name="facebook_url"
                  value={formData.facebook_url || ''}
                  onChange={handleChange}
                  placeholder="https://facebook.com/page"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Linkedin
                </label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram_url"
                  name="instagram_url"
                  value={formData.instagram_url || ''}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  id="youtube_url"
                  name="youtube_url"
                  value={formData.youtube_url || ''}
                  onChange={handleChange}
                  placeholder="https://youtube.com/channel/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="skype_username" className="block text-sm font-medium text-gray-700 mb-1">
                  Skype
                </label>
                <input
                  type="text"
                  id="skype_username"
                  name="skype_username"
                  value={formData.skype_username || ''}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Whatsapp
                </label>
                <input
                  type="tel"
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number || ''}
                  onChange={handleChange}
                  placeholder="+386 41 123 456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Spremeni geslo</h2>
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              Geslo mora vsebovati vsaj 12 znakov.
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Trenutno geslo
                </label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Novo geslo
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Potrdi novo geslo
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500">
                Funkcija spreminjanja gesla bo kmalu na voljo.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
              className="px-8"
            >
              {updateMutation.isPending ? 'Shranjujem...' : 'Shrani spremembe'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default MojProfil;
