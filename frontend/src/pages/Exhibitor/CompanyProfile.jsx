import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import {
  Building2,
  FileText,
  Save,
  Loader2,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyProfile = () => {
  const [loading, setLoading] = useState(false);

  const [productNameInput, setProductNameInput] = useState('');
  const [productFileInput, setProductFileInput] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [docFiles, setDocFiles] = useState([]);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    description: '',
    contactPhone: '',
    productShowcase: [],
    documents: [],
    logo: ''
  });

  // =====================================================
  // IMAGE URL
  // =====================================================

  const renderImgUrl = (path) => {
    if (!path) return '';

    if (typeof path !== 'string') {
      return '';
    }

    // Cloudinary / external URL
    if (
      path.startsWith('http://') ||
      path.startsWith('https://')
    ) {
      return path;
    }

    // Old local upload path support
    const baseURL =
      axios.defaults?.baseURL ||
      '';

    if (path.startsWith('/')) {
      return `${baseURL}${path}`;
    }

    return `${baseURL}/${path}`;
  };

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.log('No token found');
          return;
        }

        const res = await axios.get(
          '/api/exhibitor/my-profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.data) {
          setFormData({
            companyName: res.data.companyName || '',
            industry: res.data.industry || '',
            description: res.data.description || '',
            contactPhone: res.data.contactPhone || '',

            productShowcase:
              Array.isArray(res.data.productShowcase)
                ? res.data.productShowcase
                : [],

            documents:
              Array.isArray(res.data.documents)
                ? res.data.documents
                : [],

            logo: res.data.logo || ''
          });
        }
      } catch (error) {
        console.error(
          'Fetch Profile Error:',
          error
        );

        if (error.response?.status !== 404) {
          toast.error(
            error.response?.data?.message ||
              'Unable to load company profile.'
          );
        }
      }
    };

    fetchProfile();
  }, []);

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = () => {
    const productName = productNameInput.trim();

    if (!productName) {
      toast.warn('Please enter product name.');
      return;
    }

    if (!productFileInput) {
      toast.warn('Please select product image.');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/jfif',
      'image/pjpeg'
    ];

    const fileName =
      productFileInput.name?.toLowerCase() || '';

    const validExtension =
      /\.(jpg|jpeg|png|webp|jfif)$/i.test(
        fileName
      );

    if (
      !allowedTypes.includes(
        productFileInput.type
      ) &&
      !validExtension
    ) {
      toast.error(
        'Please select a valid image file.'
      );
      return;
    }

    const newProduct = {
      name: productName,
      file: productFileInput,
      preview:
        URL.createObjectURL(productFileInput)
    };

    setFormData((prev) => ({
      ...prev,
      productShowcase: [
        ...prev.productShowcase,
        newProduct
      ]
    }));

    setProductNameInput('');
    setProductFileInput(null);

    const fileInput =
      document.getElementById(
        'product-image-input'
      );

    if (fileInput) {
      fileInput.value = '';
    }
  };

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeProduct = (index) => {
    setFormData((prev) => {
      const product =
        prev.productShowcase[index];

      if (
        product?.preview &&
        product.preview.startsWith('blob:')
      ) {
        URL.revokeObjectURL(product.preview);
      }

      return {
        ...prev,
        productShowcase:
          prev.productShowcase.filter(
            (_, i) => i !== index
          )
      };
    });
  };

  // =====================================================
  // REMOVE DOCUMENT
  // =====================================================

  const removeExistingDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents:
        prev.documents.filter(
          (_, i) => i !== index
        )
    }));
  };

  // =====================================================
  // LOGO FILE
  // =====================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/jfif',
      'image/pjpeg'
    ];

    const fileName =
      file.name?.toLowerCase() || '';

    const validExtension =
      /\.(jpg|jpeg|png|webp|jfif)$/i.test(
        fileName
      );

    if (
      !allowedTypes.includes(file.type) &&
      !validExtension
    ) {
      toast.error(
        'Please select a valid logo image.'
      );

      e.target.value = '';
      return;
    }

    setLogoFile(file);
  };

  // =====================================================
  // DOCUMENT FILES
  // =====================================================

  const handleDocumentChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    const validFiles = files.filter((file) => {
      const fileName =
        file.name?.toLowerCase() || '';

      return (
        file.type === 'application/pdf' ||
        /\.(pdf|jpg|jpeg|png|webp|jfif)$/i.test(
          fileName
        )
      );
    });

    if (
      validFiles.length !== files.length
    ) {
      toast.warn(
        'Some invalid files were removed. Only PDF and image files are allowed.'
      );
    }

    setDocFiles(validFiles);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem('token');

      if (!token) {
        toast.error(
          'Session expired. Please login again.'
        );
        return;
      }

      const data = new FormData();

      // -------------------------------------------------
      // BASIC DATA
      // -------------------------------------------------

      data.append(
        'companyName',
        formData.companyName || ''
      );

      data.append(
        'industry',
        formData.industry || ''
      );

      data.append(
        'description',
        formData.description || ''
      );

      data.append(
        'contactPhone',
        formData.contactPhone || ''
      );

      // -------------------------------------------------
      // EXISTING DOCUMENTS
      // -------------------------------------------------

      data.append(
        'existingDocuments',
        JSON.stringify(
          formData.documents || []
        )
      );

      // -------------------------------------------------
      // PRODUCTS
      // -------------------------------------------------

      const existingProducts = [];

      formData.productShowcase.forEach(
        (item) => {
          // Existing product from DB
          if (!item.file) {
            existingProducts.push({
              name: item.name || 'Product',
              image: item.image || ''
            });
          }

          // New product image
          else {
            data.append(
              'productImages',
              item.file
            );

            data.append(
              'productNames',
              item.name || 'Product'
            );
          }
        }
      );

      data.append(
        'existingProducts',
        JSON.stringify(
          existingProducts
        )
      );

      // -------------------------------------------------
      // LOGO
      // -------------------------------------------------

      if (logoFile) {
        data.append(
          'logo',
          logoFile,
          logoFile.name
        );
      }

      // -------------------------------------------------
      // DOCUMENTS
      // -------------------------------------------------

      docFiles.forEach((file) => {
        data.append(
          'documents',
          file,
          file.name
        );
      });

      // -------------------------------------------------
      // DEBUG
      // -------------------------------------------------

      console.log(
        'Submitting profile...'
      );

      for (const pair of data.entries()) {
        console.log(
          pair[0],
          pair[1]
        );
      }

      // -------------------------------------------------
      // API CALL
      // IMPORTANT:
      // Do NOT manually set Content-Type
      // -------------------------------------------------

      const res =
        await axios.post(
          '/api/exhibitor/update-profile',
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      console.log(
        'Update response:',
        res.data
      );

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      if (
        res.data?.success ||
        res.status === 200
      ) {
        toast.success(
          'Profile Updated Successfully!'
        );

        const profile =
          res.data.profile;

        if (profile) {
          setFormData({
            companyName:
              profile.companyName || '',

            industry:
              profile.industry || '',

            description:
              profile.description || '',

            contactPhone:
              profile.contactPhone || '',

            productShowcase:
              Array.isArray(
                profile.productShowcase
              )
                ? profile.productShowcase
                : [],

            documents:
              Array.isArray(
                profile.documents
              )
                ? profile.documents
                : [],

            logo:
              profile.logo || ''
          });
        }

        setLogoFile(null);
        setDocFiles([]);

        const logoInput =
          document.querySelector(
            'input[type="file"]'
          );

        // Refresh profile from DB after upload
        try {
          const fresh =
            await axios.get(
              '/api/exhibitor/my-profile',
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

          if (fresh.data) {
            setFormData({
              companyName:
                fresh.data.companyName ||
                '',

              industry:
                fresh.data.industry || '',

              description:
                fresh.data.description ||
                '',

              contactPhone:
                fresh.data.contactPhone ||
                '',

              productShowcase:
                Array.isArray(
                  fresh.data.productShowcase
                )
                  ? fresh.data.productShowcase
                  : [],

              documents:
                Array.isArray(
                  fresh.data.documents
                )
                  ? fresh.data.documents
                  : [],

              logo:
                fresh.data.logo || ''
            });
          }
        } catch (refreshError) {
          console.error(
            'Profile refresh error:',
            refreshError
          );
        }
      }
    } catch (err) {
      console.error(
        'Submission Error:',
        err
      );

      console.error(
        'Response:',
        err.response?.data
      );

      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Update Failed. Please check server logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-8 animate-fadeInUp">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 backdrop-blur-xl bg-white/5 transition-all duration-500">

        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
            <Sparkles
              className="text-[#d100a0]"
              size={28}
            />

            Company Profile
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Manage your company details, products,
            documents and branding assets.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)] border border-white/20">
          <Building2
            size={22}
            className="text-white"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-8 md:p-10 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 backdrop-blur-xl bg-white/5 shadow-2xl text-white transition-all duration-500"
      >

        {/* ================================================= */}
        {/* COMPANY INFORMATION */}
        {/* ================================================= */}

        <section>

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center">
              <Building2
                size={20}
                className="text-[#d100a0]"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Company Information
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Basic information about your business.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                Company Name
              </label>

              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#d100a0]/60 focus:ring-1 focus:ring-[#d100a0]/30 transition-all"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    companyName:
                      e.target.value
                  })
                }
              />
            </div>

            <div className="space-y-2">

              <label className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                Industry
              </label>

              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#d100a0]/60 focus:ring-1 focus:ring-[#d100a0]/30 transition-all"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    industry:
                      e.target.value
                  })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">

              <label className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                Description
              </label>

              <textarea
                required
                rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#d100a0]/60 focus:ring-1 focus:ring-[#d100a0]/30 transition-all resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="space-y-2 md:col-span-2">

              <label className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                Business Contact
              </label>

              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#d100a0]/60 focus:ring-1 focus:ring-[#d100a0]/30 transition-all"
                value={
                  formData.contactPhone
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPhone:
                      e.target.value
                  })
                }
              />

            </div>

          </div>

        </section>

        <div className="border-t border-white/10" />

        {/* ================================================= */}
        {/* PRODUCT SHOWCASE */}
        {/* ================================================= */}

        <section>

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center">
              <ImageIcon
                size={20}
                className="text-[#d100a0]"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Product Showcase
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Add products that you want to display.
              </p>
            </div>

          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 grid grid-cols-1 md:grid-cols-3 gap-5 items-end">

            <div className="space-y-2">

              <label className="text-[10px] text-gray-500 uppercase font-bold">
                Product Name
              </label>

              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#d100a0]/50 transition-all"
                placeholder="Product name..."
                value={
                  productNameInput
                }
                onChange={(e) =>
                  setProductNameInput(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="space-y-2">

              <label className="text-[10px] text-gray-500 uppercase font-bold">
                Select Image
              </label>

              <input
                id="product-image-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/jfif"
                className="w-full text-xs text-gray-400 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-[#d100a0]/20 file:text-[#d100a0] file:font-bold file:cursor-pointer"
                onChange={(e) =>
                  setProductFileInput(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />

            </div>

            <button
              type="button"
              onClick={
                handleAddProduct
              }
              className="h-[48px] rounded-xl bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] hover:shadow-[0_0_25px_rgba(209,0,160,0.4)] flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-95"
            >
              <Plus size={18} />
              Add to Showcase
            </button>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">

            {formData.productShowcase?.map(
              (item, i) => (

                <div
                  key={`${item.name}-${i}`}
                  className="relative group p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-[#d100a0]/40 hover:bg-white/10 transition-all duration-300"
                >

                  <div className="w-full h-36 rounded-xl overflow-hidden mb-3 border border-white/10">

                    <img
                      src={
                        item.file
                          ? item.preview
                          : renderImgUrl(
                              item.image
                            )
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={
                        item.name ||
                        'Product'
                      }
                      onError={(e) => {
                        e.currentTarget.style.display =
                          'none';
                      }}
                    />

                  </div>

                  <p className="text-xs font-bold truncate pr-6 text-white">
                    {item.name}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeProduct(i)
                    }
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600/90 hover:bg-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg"
                  >
                    <X size={13} />
                  </button>

                </div>

              )
            )}

          </div>

        </section>

        <div className="border-t border-white/10" />

        {/* ================================================= */}
        {/* DOCUMENTS + LOGO */}
        {/* ================================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* DOCUMENTS */}

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center">

                <FileText
                  size={18}
                  className="text-[#d100a0]"
                />

              </div>

              <div>

                <h3 className="font-bold text-white">
                  Documents
                </h3>

                <p className="text-[11px] text-gray-500">
                  Upload company documents.
                </p>

              </div>

            </div>

            <div className="space-y-2 mb-4">

              {formData.documents?.map(
                (doc, i) => (

                  <div
                    key={`${doc}-${i}`}
                    className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
                  >

                    <a
                      href={renderImgUrl(doc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate flex-1 text-xs text-gray-300 hover:text-[#d100a0] underline"
                    >
                      {typeof doc ===
                      'string'
                        ? doc
                            .split(
                              '/'
                            )
                            .pop()
                        : 'Document'}
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingDoc(
                          i
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    >
                      <Trash2
                        size={14}
                        className="text-red-400"
                      />
                    </button>

                  </div>

                )
              )}

            </div>

            <input
              type="file"
              multiple
              accept=".pdf,image/jpeg,image/jpg,image/png,image/webp,image/jfif"
              className="w-full text-xs text-gray-400 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-white/10 file:text-gray-300 file:font-bold file:cursor-pointer"
              onChange={
                handleDocumentChange
              }
            />

          </div>

          {/* LOGO */}

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center">

                <Upload
                  size={18}
                  className="text-[#d100a0]"
                />

              </div>

              <div>

                <h3 className="font-bold text-white">
                  Company Logo
                </h3>

                <p className="text-[11px] text-gray-500">
                  Upload your company branding.
                </p>

              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">

              <div className="w-24 h-24 rounded-2xl border border-white/10 overflow-hidden bg-black/20 flex items-center justify-center flex-shrink-0">

                {logoFile ? (

                  <img
                    src={URL.createObjectURL(
                      logoFile
                    )}
                    className="w-full h-full object-cover"
                    alt="Company logo preview"
                  />

                ) : formData.logo ? (

                  <img
                    src={renderImgUrl(
                      formData.logo
                    )}
                    className="w-full h-full object-cover"
                    alt="Company logo"
                    onError={(e) => {
                      console.error(
                        'Logo image failed:',
                        formData.logo
                      );
                    }}
                  />

                ) : (

                  <Upload
                    className="text-gray-600"
                    size={28}
                  />

                )}

              </div>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/jfif"
                className="w-full text-xs text-gray-400 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-[#d100a0]/20 file:text-[#d100a0] file:font-bold file:cursor-pointer"
                onChange={
                  handleLogoChange
                }
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* SUBMIT */}
        {/* ================================================= */}

        <button
          type="submit"
          disabled={loading}
          className="group relative overflow-hidden w-full bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] text-white py-4 rounded-2xl flex justify-center items-center gap-3 font-black hover:shadow-[0_0_35px_rgba(209,0,160,0.5)] hover:scale-[1.01] transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
        >

          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <span className="relative z-10 flex items-center gap-3">

            {loading ? (
              <Loader2
                className="animate-spin"
                size={22}
              />
            ) : (
              <Save size={22} />
            )}

            {loading
              ? 'Updating Profile...'
              : 'Update Profile & Assets'}

          </span>

        </button>

      </form>
    </div>
  );
};

export default CompanyProfile;