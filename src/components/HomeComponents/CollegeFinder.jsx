import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CollegeFinder = () => {
  const [allColleges, setAllColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedOwnership, setSelectedOwnership] = useState("all");
  const [feeMin, setFeeMin] = useState(0);
  const [feeMax, setFeeMax] = useState(500000);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const categories = [
    "all","Engineering","Management","Commerce & Banking","Medical",
    "Sciences","Hotel Management","Information Technology","Arts & Humanities",
    "Mass Communication","Nursing","Agriculture","Design","Law","Pharmacy",
    "Para Medical","Dental","Performing Arts","Education"
  ];

  const ownershipOptions = ["all","Government","Private","Deemed"];

  // ✅ Base URL setup for production backend
  const BASE_URL = "https://getcollege-backend.onrender.com/api/colleges";

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        // ✅ Fetch from your live backend
        const { data } = await axios.get(BASE_URL);
        const colleges = data.data || data.colleges || [];

        setAllColleges(colleges);

        // ✅ Extract unique city list
        const uniqueLocations = Array.from(
          new Set(colleges.map((c) => c.location?.city).filter(Boolean))
        );
        setLocations(["all", ...uniqueLocations]);
      } catch (err) {
        console.error("Error fetching colleges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  // ✅ Filtering logic
  useEffect(() => {
    let filtered = allColleges;

    if (
      searchTerm ||
      selectedCategory !== "all" ||
      selectedLocation !== "all" ||
      selectedOwnership !== "all" ||
      feeMin !== 0 ||
      feeMax !== 500000
    ) {
      if (searchTerm) {
        filtered = filtered.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedCategory !== "all") {
        filtered = filtered.filter((c) => c.category === selectedCategory);
      }
      if (selectedLocation !== "all") {
        filtered = filtered.filter((c) => c.location?.city === selectedLocation);
      }
      if (selectedOwnership !== "all") {
        filtered = filtered.filter((c) => c.ownership === selectedOwnership);
      }
      filtered = filtered.filter(
        (c) =>
          (c.feeRange?.min || 0) >= feeMin &&
          (c.feeRange?.max || 500000) <= feeMax
      );
    }

    setFilteredColleges(filtered.slice(0, visibleCount));
  }, [
    allColleges,
    searchTerm,
    selectedCategory,
    selectedLocation,
    selectedOwnership,
    feeMin,
    feeMax,
    visibleCount,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedOwnership("all");
    setFeeMin(0);
    setFeeMax(500000);
    setVisibleCount(10);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="bg-gray-100 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Find Your Perfect College
        </h2>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Filter Colleges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <input
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2 px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l === "all" ? "All Locations" : l}
                </option>
              ))}
            </select>

            <select
              value={selectedOwnership}
              onChange={(e) => setSelectedOwnership(e.target.value)}
              className="px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            >
              {ownershipOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "all" ? "All Ownerships" : o}
                </option>
              ))}
            </select>

            <button
              onClick={handleClearFilters}
              className="px-5 py-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium shadow-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Colleges Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="col-span-full text-center text-gray-500 text-lg py-12">
              Loading colleges...
            </p>
          ) : filteredColleges.length > 0 ? (
            filteredColleges.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transform transition-all duration-200"
                onClick={() => navigate(`/colleges/${c._id}`)}
              >
                <div className="h-48 w-full relative">
                  <img
                    src={
                      c.images?.[0]?.url ||
                      "https://via.placeholder.com/400x200?text=College+Image"
                    }
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-xl">{c.name}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-500 mb-3">
                    {c.category} | {c.location?.city}, {c.location?.state}
                  </p>
                  <p className="text-gray-700 font-medium mb-3">
                    ₹{(c.feeRange?.min || 0).toLocaleString()} - ₹
                    {(c.feeRange?.max || 0).toLocaleString()}
                  </p>
                  <p className="text-gray-600 mb-4">{c.ownership}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/colleges/${c._id}`);
                    }}
                    className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition w-full font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg py-12">
              No colleges found for the selected filters.
            </p>
          )}
        </div>

        {/* Load More */}
        {filteredColleges.length > 0 &&
          filteredColleges.length < allColleges.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition shadow-md"
              >
                Load More Colleges
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default CollegeFinder;
