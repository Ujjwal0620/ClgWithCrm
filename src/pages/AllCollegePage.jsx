import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import axios from "axios";

// Base URL for API
axios.defaults.baseURL = "https://getcollege-backend.onrender.com";
// Disable credentials to avoid CORS issues
axios.defaults.withCredentials = false;

const AllCollegePage = () => {
  const [colleges, setColleges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    state: "",
    ownership: "",
    minFee: "",
    maxFee: "",
    minRating: "",
    category: "",
  });

  // Fetch all colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await axios.get("/api/colleges");
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.colleges)
          ? data.colleges
          : Array.isArray(data.data)
          ? data.data
          : [];
        setColleges(list);
        setFiltered(list);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setColleges([]);
        setFiltered([]);
      }
    };
    fetchColleges();
  }, []);

  // Apply filters
  useEffect(() => {
    const result = colleges.filter((c) => {
      if (filters.state && !c.location?.state?.toLowerCase().includes(filters.state.toLowerCase()))
        return false;
      if (filters.ownership && c.ownership !== filters.ownership) return false;
      if (filters.category && (!c.category || c.category.toLowerCase() !== filters.category.toLowerCase()))
        return false;
      if (filters.minFee && !(c.feeRange?.min >= Number(filters.minFee))) return false;
      if (filters.maxFee && !(c.feeRange?.max <= Number(filters.maxFee))) return false;
      if (filters.minRating && !(Number(c.rating) >= Number(filters.minRating))) return false;
      return true;
    });
    setFiltered(result);
  }, [filters, colleges]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b17] to-[#1a1a2e] text-white px-8 md:px-16 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-4xl md:text-5xl font-extrabold mb-10 text-cyan-400 drop-shadow-lg tracking-wide"
      >
        🎓 Explore All Top Colleges in India
      </motion.h1>

      {/* Filters */}
      <motion.div className="bg-[#151528]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-cyan-700/40 mb-10 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search by State"
          className="bg-transparent border border-cyan-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        />
        <select
          className="bg-transparent border border-cyan-600 px-4 py-2 rounded-lg focus:outline-none"
          onChange={(e) => setFilters({ ...filters, ownership: e.target.value })}
        >
          <option value="">Ownership</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
          <option value="Deemed">Deemed</option>
        </select>
        <select
          className="bg-transparent border border-cyan-600 px-4 py-2 rounded-lg focus:outline-none"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Category</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
          <option value="Management">Management</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Law">Law</option>
          <option value="Arts & Humanities">Arts & Humanities</option>
        </select>
        <input
          type="number"
          placeholder="Min Fee"
          className="bg-transparent border border-cyan-600 px-4 py-2 rounded-lg w-28"
          onChange={(e) => setFilters({ ...filters, minFee: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Fee"
          className="bg-transparent border border-cyan-600 px-4 py-2 rounded-lg w-28"
          onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
        />
        <select
          className="bg-transparent border border-cyan-600 px-4 py-2 rounded-lg focus:outline-none"
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
        >
          <option value="">Min Rating</option>
          <option value="3">3 ★ & above</option>
          <option value="4">4 ★ & above</option>
          <option value="4.5">4.5 ★ & above</option>
        </select>
      </motion.div>

      {/* College Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.length > 0 ? (
          filtered.map((college, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0,255,255,0.4)" }}
              transition={{ duration: 0.4 }}
              className="bg-[#16162a]/90 backdrop-blur-lg border border-cyan-600/30 hover:border-cyan-400/70 transition-all rounded-2xl overflow-hidden shadow-lg group"
            >
              <div className="relative">
                <img
                  src={college.images?.[0]?.url || "https://images.unsplash.com/photo-1581091215367-59ab6b243c3c?auto=format&fit=crop&w=800&q=60"}
                  alt={college.name || "College"}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 bg-cyan-600/90 text-black text-xs font-semibold px-2 py-1 rounded-lg">
                  {college.category || "General"}
                </span>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-cyan-300 mb-1 line-clamp-1">{college.name || "Unknown"}</h2>
                <p className="text-sm text-gray-400 mb-2">
                  {college.location?.city || "City"}, {college.location?.state || "State"}
                </p>

                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className={`${j < Math.round(college.rating || 0) ? "text-yellow-400" : "text-gray-700"}`} />
                  ))}
                  <span className="ml-2 text-xs text-gray-400">{college.rating?.toFixed(1) || "N/A"} ({college.reviewCount || 0})</span>
                </div>

                <p className="text-gray-300 text-xs mb-1">💰 Fees: ₹{college.feeRange?.min?.toLocaleString() || "N/A"} – ₹{college.feeRange?.max?.toLocaleString() || "N/A"}</p>
                <p className="text-gray-300 text-xs mb-1">🎓 Avg Package: {college.placement?.averagePackage || "N/A"}</p>
                <p className="text-gray-300 text-xs mb-3">🏆 Rank: {college.ranking?.national || "N/A"} (National)</p>

                <a href={college.website || "#"} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-3 py-1.5 rounded-lg text-sm transition-all">
                  Visit Website
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No colleges found matching filters.</p>
        )}
      </div>
    </div>
  );
};

export default AllCollegePage;
