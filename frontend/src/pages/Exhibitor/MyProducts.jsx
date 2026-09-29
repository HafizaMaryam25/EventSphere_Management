import React, { useState, useEffect } from 'react';
import axios, { getImageUrl } from '../../lib/api';
import {
  Package,
  Search,
  ExternalLink,
  Box,
  Loader2,
  Tag,
  LayoutGrid,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('/api/exhibitor/my-profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data && res.data.productShowcase) {
          setProducts(res.data.productShowcase);
        }

      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeInUp text-white">

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/exhibitor/dashboard')}
        className="group flex items-center gap-2 text-gray-400 hover:text-[#d100a0] transition-all duration-300 text-sm font-medium"
      >
        <ArrowLeft
          size={18}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back to Exhibitor Dashboard
      </button>

      {/* Header */}
      <div className="relative overflow-hidden p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 backdrop-blur-xl bg-white/5 transition-all duration-500">

        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d100a0]/10 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_25px_rgba(209,0,160,0.4)] border border-white/20">
              <Package
                size={26}
                className="text-white"
              />
            </div>

            <div>

              <h2 className="text-3xl font-black font-heading tracking-tight flex items-center gap-2">
                My Product Showcase
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Manage and view all products you are showcasing in the expo.
              </p>

            </div>

          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:border-[#d100a0]/50 focus:ring-1 focus:ring-[#d100a0]/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>
      </div>

      {/* Loading */}
      {loading ? (

        <div className="p-20 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center">

          <Loader2
            className="animate-spin text-[#d100a0]"
            size={48}
          />

          <p className="text-gray-500 mt-4 animate-pulse text-sm">
            Loading your inventory...
          </p>

        </div>

      ) : filteredProducts.length === 0 ? (

        /* Empty */
        <div className="p-20 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">

          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Box
              size={38}
              className="text-[#d100a0]"
            />
          </div>

          <h3 className="text-xl font-bold text-white">
            No Products Found
          </h3>

          <p className="text-gray-500 mt-2 text-center max-w-sm text-sm leading-relaxed">
            {searchTerm
              ? "No products match your search."
              : "You haven't added any products yet. Go to your profile to add products."}
          </p>

          {!searchTerm && (
            <button
              onClick={() =>
                navigate('/exhibitor/dashboard/add-profile')
              }
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d100a0] to-[#6b21a8] text-white font-bold hover:shadow-[0_0_25px_rgba(209,0,160,0.4)] transition-all active:scale-95"
            >
              Add Products
            </button>
          )}

        </div>

      ) : (

        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {filteredProducts.map(
            (product, index) => (

              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.2)] transition-all duration-500 hover:-translate-y-1 flex flex-col"
              >

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-black/20">

                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4">

                    <div className="w-10 h-10 bg-[#d100a0]/15 backdrop-blur-xl border border-[#d100a0]/30 rounded-xl flex items-center justify-center text-[#d100a0] shadow-lg">
                      <Tag size={16} />
                    </div>

                  </div>

                  {/* Bottom Image Label */}
                  <div className="absolute bottom-4 left-4 right-4">

                    <div className="flex items-center gap-2 text-[#d100a0]">

                      <LayoutGrid size={13} />

                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Digital Catalog
                      </span>

                    </div>

                  </div>

                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">

                  <div className="flex-1">

                    <h3 className="text-xl font-bold text-white group-hover:text-[#d100a0] transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>

                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">

                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      Verified Asset
                    </span>

                    <button
                      type="button"
                      className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#d100a0] transition-colors"
                    >
                      DETAILS
                      <ExternalLink size={14} />
                    </button>

                  </div>

                </div>

                {/* Glow */}
                <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#d100a0]/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
};

export default MyProducts;