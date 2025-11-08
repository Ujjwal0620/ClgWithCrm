import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const EngineeringPage = () => {
  const [colleges, setColleges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    state: "",
    ownership: "",
    minFee: "",
    maxFee: "",
    minRating: "",
  });

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch(
          "https://getcollege-backend.onrender.com/api/colleges?category=Engineering"
        );
        const data = await res.json();

        // ✅ Handle various backend response formats
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.colleges)
          ? data.colleges
          : Array.isArray(data.data)
          ? data.data
          : [];

        // ✅ Normalize category comparison to lowercase
        const engineeringOnly = list.filter(
          (college) =>
            college.category &&
            college.category.toLowerCase() === "engineering"
        );

        setColleges(engineeringOnly);
        setFiltered(engineeringOnly);
      } catch (err) {
        console.error("Error fetching Engineering colleges:", err);
        setColleges([]);
        setFiltered([]);
      }
    };

    fetchColleges();
  }, []);

  // ✅ Apply filters dynamically
  useEffect(() => {
    let result = [...colleges];

    if (filters.state)
      result = result.filter(
        (c) =>
          c.location?.state &&
          c.location.state
            .toLowerCase()
            .includes(filters.state.toLowerCase())
      );

    if (filters.ownership)
      result = result.filter((c) => c.ownership === filters.ownership);

    if (filters.minFee)
      result = result.filter((c) => c.feeRange?.min >= Number(filters.minFee));

    if (filters.maxFee)
      result = result.filter((c) => c.feeRange?.max <= Number(filters.maxFee));

    if (filters.minRating)
      result = result.filter((c) => c.rating >= Number(filters.minRating));

    setFiltered(result);
  }, [filters, colleges]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b17] to-[#1a1a2e] text-white px-8 md:px-16 py-10">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-4xl md:text-5xl font-extrabold mb-10 text-cyan-400 drop-shadow-lg tracking-wide"
      >
        ⚙️ Top Engineering Colleges in India
      </motion.h1>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#151528]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-cyan-700/40 mb-10 flex flex-wrap gap-4 justify-center"
      >
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
          <option className="text-black" value="Government">
            Government
          </option>
          <option className="text-black" value="Private">
            Private
          </option>
          <option className="text-black" value="Deemed">
            Deemed
          </option>
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
          onChange={(e) =>
            setFilters({ ...filters, minRating: e.target.value })
          }
        >
          <option className="text-black" value="">
            Min Rating
          </option>
          <option className="text-black" value="3">
            3 ★ & above
          </option>
          <option className="text-black" value="4">
            4 ★ & above
          </option>
          <option className="text-black" value="4.5">
            4.5 ★ & above
          </option>
        </select>
      </motion.div>

      {/* College Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.length > 0 ? (
          filtered.map((college, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(0,255,255,0.4)",
              }}
              transition={{ duration: 0.4 }}
              className="bg-[#16162a]/90 backdrop-blur-lg border border-cyan-600/30 hover:border-cyan-400/70 transition-all rounded-2xl overflow-hidden shadow-lg group"
            >
              <div className="relative">
                <img
                  src={
                    college.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60"
                  }
                  alt={college.name}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 bg-cyan-600/90 text-black text-xs font-semibold px-2 py-1 rounded-lg">
                  {college.ownership}
                </span>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-cyan-300 mb-1 line-clamp-1">
                  {college.name}
                </h2>
                <p className="text-sm text-gray-400 mb-2">
                  {college.location?.city}, {college.location?.state}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.round(college.rating)
                          ? "text-yellow-400"
                          : "text-gray-700"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs text-gray-400">
                    {college.rating?.toFixed(1) || "0.0"} (
                    {college.reviewCount || 0})
                  </span>
                </div>

                {/* Fee and Placement */}
                <p className="text-gray-300 text-xs mb-1">
                  💰 Fees: ₹
                  {college.feeRange?.min?.toLocaleString() || "N/A"} – ₹
                  {college.feeRange?.max?.toLocaleString() || "N/A"}
                </p>
                <p className="text-gray-300 text-xs mb-1">
                  🎓 Avg Package:{" "}
                  {college.placement?.averagePackage || "N/A"}
                </p>
                <p className="text-gray-300 text-xs mb-3">
                  🏆 Rank: {college.ranking?.national || "N/A"} (National)
                </p>

                <a
                  href={college.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-3 py-1.5 rounded-lg text-sm transition-all"
                >
                  Visit Website
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No Engineering colleges found matching filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default EngineeringPage;
