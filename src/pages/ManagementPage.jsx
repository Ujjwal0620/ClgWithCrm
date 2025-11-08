import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const ManagementPage = () => {
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
          "https://getcollege-backend.onrender.com/api/colleges?category=Management"
        );
        const data = await res.json();

        // ✅ Handle different response formats safely
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.colleges)
          ? data.colleges
          : Array.isArray(data.data)
          ? data.data
          : [];

        // ✅ Ensure only Management category is shown
        const managementOnly = list.filter(
          (college) =>
            college.category &&
            college.category.toLowerCase() === "management"
        );

        setColleges(managementOnly);
        setFiltered(managementOnly);
      } catch (err) {
        console.error("Error fetching Management colleges:", err);
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
      result = result.filter((c) =>
        c.location?.state
          ?.toLowerCase()
          .includes(filters.state.toLowerCase())
      );

    if (filters.ownership)
      result = result.filter((c) => c.ownership === filters.ownership);

    if (filters.minFee)
      result = result.filter(
        (c) => (c.feeRange?.min || 0) >= Number(filters.minFee)
      );

    if (filters.maxFee)
      result = result.filter(
        (c) => (c.feeRange?.max || 0) <= Number(filters.maxFee)
      );

    if (filters.minRating)
      result = result.filter(
        (c) => (c.rating || 0) >= Number(filters.minRating)
      );

    setFiltered(result);
  }, [filters, colleges]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#141432] to-[#1c1c3c] text-white px-8 md:px-16 py-14 font-sans">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-md">
          Top Management Colleges in India
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Discover the most prestigious B-Schools and Management Institutions
          across India.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#151528]/70 backdrop-blur-lg border border-cyan-500/30 rounded-3xl p-6 flex flex-wrap justify-center gap-5 shadow-2xl mb-16"
      >
        <input
          type="text"
          placeholder="Search by State"
          className="bg-transparent border border-cyan-600/60 px-4 py-2 rounded-xl w-52 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        />
        <select
          className="bg-transparent border border-cyan-600/60 px-4 py-2 rounded-xl text-sm w-44 outline-none"
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
          className="bg-transparent border border-cyan-600/60 px-4 py-2 rounded-xl w-28 text-sm outline-none"
          onChange={(e) => setFilters({ ...filters, minFee: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Fee"
          className="bg-transparent border border-cyan-600/60 px-4 py-2 rounded-xl w-28 text-sm outline-none"
          onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
        />
        <select
          className="bg-transparent border border-cyan-600/60 px-4 py-2 rounded-xl text-sm w-44 outline-none"
          onChange={(e) =>
            setFilters({ ...filters, minRating: e.target.value })
          }
        >
          <option value="">Min Rating</option>
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

      {/* Advertisement Section */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        {[
          {
            img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=60",
            link: "https://www.iima.ac.in/",
            title: "IIM Ahmedabad",
          },
          {
            img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=60",
            link: "https://www.isb.edu/",
            title: "ISB Hyderabad",
          },
          {
            img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60",
            link: "https://www.xlri.ac.in/",
            title: "XLRI Jamshedpur",
          },
        ].map((ad, idx) => (
          <motion.a
            key={idx}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 35px rgba(0,255,255,0.4)",
            }}
            className="w-[320px] h-[200px] rounded-3xl overflow-hidden border border-cyan-700/40 relative group transition-all duration-500 shadow-lg"
          >
            <img
              src={ad.img}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-100"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-cyan-300 text-lg font-semibold">
                {ad.title}
              </h3>
            </div>
          </motion.a>
        ))}
      </div>

      {/* College Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-14">
        {filtered.length > 0 ? (
          filtered.map((college, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(0,255,255,0.4)",
              }}
              transition={{ duration: 0.4 }}
              className="bg-[#181833]/80 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400/70 rounded-3xl overflow-hidden shadow-xl group"
            >
              <div className="relative">
                <img
                  src={
                    college.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=60"
                  }
                  alt={college.name}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 bg-cyan-500/90 text-black text-xs font-bold px-2 py-1 rounded-lg">
                  {college.ownership}
                </span>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-cyan-300 mb-1 line-clamp-1">
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
                        i < Math.round(college.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-700"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs text-gray-400">
                    {college.rating?.toFixed(1) || "N/A"} (
                    {college.reviewCount || 0})
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-1">
                  💰 Fees: ₹{college.feeRange?.min?.toLocaleString() || 0} – ₹
                  {college.feeRange?.max?.toLocaleString() || 0}
                </p>
                <p className="text-gray-300 text-sm mb-1">
                  🎓 Avg Package:{" "}
                  {college.placement?.averagePackage || "N/A"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  🏆 Rank: {college.ranking?.national || "N/A"} (National)
                </p>

                <a
                  href={college.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                >
                  Visit Website
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full text-lg">
            No Management colleges found matching filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagementPage;
