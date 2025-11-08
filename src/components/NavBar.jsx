// NavBar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import debounce from "lodash.debounce";
import logo from '../assets/logo.png'
const NavBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [query, setQuery] = useState("");
  const [allColleges, setAllColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  // Fetch all colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/colleges");
        const collegesArray = data.data || [];
        setAllColleges(collegesArray);

        // Get unique locations for optional filtering
        const uniqueLocations = Array.from(
          new Set(
            collegesArray.map(c => c.location?.city).filter(Boolean)
          )
        );
        setLocations(["all", ...uniqueLocations]);
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  // Debounced search filter
  const handleSearch = debounce((value) => {
    if (!value.trim()) {
      setFilteredColleges([]);
      return;
    }
    const results = allColleges.filter(
      (college) =>
        college.name.toLowerCase().includes(value.toLowerCase()) ||
        (college.location?.city &&
          college.location.city.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredColleges(results);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleCollegeClick = (id) => {
    setQuery("");
    setFilteredColleges([]);
    setShowSearch(false);
    navigate(`/college/${id}`); // Navigate using ID
  };

  return (
    <div className="relative z-50">
      {/* Navbar */}
      <div className="bg-[rgb(5,0,56)] px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between relative">
        {/* Left: Logo + Menu */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <button
              className="md:hidden text-white"
              onClick={() => setShowSidebar(true)}
            >
              <FiMenu className="w-7 h-7" />
            </button>
            <Link to="/">
              <img
                className="w-22 md:h-24 md:w-24 invert"
                src={logo}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Mobile icons */}
          <div className="flex space-x-4 items-center text-white md:hidden">
            <Link to="/profile">
              <CgProfile className="w-7 h-7 cursor-pointer" />
            </Link>
            <button onClick={() => setShowSearch(!showSearch)}>
              <CiSearch className="w-7 h-7 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Nav Links Desktop */}
        <div className="hidden md:flex flex-wrap gap-6 text-white font-medium">
          <Link to="/management" className="hover:text-blue-400">
            Management
          </Link>
          <Link to="/engineering" className="hover:text-blue-400">
            Engineering
          </Link>
          <Link to="/medical" className="hover:text-blue-400">
            Medical
          </Link>
          <Link to="/more" className="hover:text-blue-400">
            More
          </Link>
        </div>

        {/* Right Icons Desktop */}
        <div className="hidden md:flex space-x-4 items-center text-white">
          <Link to="/profile">
            <CgProfile className="w-7 h-7 cursor-pointer" />
          </Link>
          <button onClick={() => setShowSearch(!showSearch)}>
            <CiSearch className="w-7 h-7 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSidebar(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[rgb(5,0,56)]">Menu</h2>
              <button onClick={() => setShowSidebar(false)}>
                <FiX className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-gray-800 font-medium">
              <Link to="/management" onClick={() => setShowSidebar(false)}>
                Management
              </Link>
              <Link to="/engineering" onClick={() => setShowSidebar(false)}>
                Engineering
              </Link>
              <Link to="/medical" onClick={() => setShowSidebar(false)}>
                Medical
              </Link>
              <Link to="/more" onClick={() => setShowSidebar(false)}>
                More
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* Search */}
      {showSearch && (
        <div className="bg-white shadow-md p-4 w-full max-w-5xl mx-auto mt-2 relative">
          <h2 className="text-lg font-semibold mb-2 text-[rgb(5,0,56)]">
            Search for best colleges, Courses, Exams and Education updates
          </h2>
          <input
            type="text"
            placeholder="Enter College, Course, or Location"
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={query}
            onChange={handleInputChange}
          />

          {query && (
            <div className="absolute bg-white border mt-1 rounded-md w-full max-h-60 overflow-y-auto shadow-lg z-50">
              {loading ? (
                <p className="px-4 py-2 text-gray-500">Loading...</p>
              ) : filteredColleges.length > 0 ? (
                filteredColleges.map((college) => (
                  <div
                    key={college._id}
                    onClick={() => handleCollegeClick(college._id)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {college.name}{" "}
                    {college.location?.city && (
                      <span className="text-gray-400 text-sm">
                        - {college.location.city}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">No results found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
