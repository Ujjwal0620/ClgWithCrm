import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [review, setReview] = useState({ stars: 5, comment: "" });

  // ✅ Base configuration for Axios
  axios.defaults.baseURL = "https://getcollege-backend.onrender.com";
  axios.defaults.withCredentials = false;

  useEffect(() => {
    fetchCollegeDetail();
  }, [id]);

  // ✅ Fetch one college by ID
  const fetchCollegeDetail = async () => {
    try {
      const { data } = await axios.get(`/api/colleges/${id}`);
      console.log("Fetched college:", data);

      // Adjust based on backend response shape
      setCollege(data.data || data.college || data);
    } catch (error) {
      console.error("Error fetching college details:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Review Handler
  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/colleges/${id}/reviews`, review);
      setReview({ stars: 5, comment: "" });
      fetchCollegeDetail(); // Refresh data after review submission
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (loading)
    return <div className="text-center py-12 text-lg font-medium">Loading college details...</div>;

  if (!college)
    return (
      <div className="text-center py-12 text-red-600 font-semibold">
        College not found or unable to connect to backend.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 mb-4"
          >
            ← Back to Colleges
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <img
                src={college.images?.[0]?.url || "/default-college.jpg"}
                alt={college.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {college.name}
              </h1>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
                  {college.category}
                </span>
                <span className="flex items-center text-yellow-600">
                  ★ {college.rating?.toFixed(1)} ({college.reviewCount} reviews)
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-medium">
                    {college.location?.city}, {college.location?.state}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Established</p>
                  <p className="font-medium">{college.establishedYear}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Ownership</p>
                  <p className="font-medium">{college.ownership}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fee Range</p>
                  <p className="font-medium">
                    ₹{college.feeRange?.min?.toLocaleString()} - ₹
                    {college.feeRange?.max?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link to="/signuppop">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Apply Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              "overview",
              "courses",
              "placement",
              "facilities",
              "reviews",
              "gallery",
            ].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">
                About {college.name}
              </h2>
              <p className="text-gray-700 mb-6">{college.description}</p>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Exams Accepted</h3>
                  <div className="flex flex-wrap gap-2">
                    {college.examsAccepted?.map((exam, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Rankings</h3>
                  <div className="space-y-1">
                    {college.ranking?.national && (
                      <p>National: #{college.ranking.national}</p>
                    )}
                    {college.ranking?.state && (
                      <p>State: #{college.ranking.state}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Campus Area</span>
                  <span className="font-medium">{college.campus?.area || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Faculty Strength</span>
                  <span className="font-medium">{college.faculty?.total || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Student-Faculty Ratio</span>
                  <span className="font-medium">{college.faculty?.studentRatio || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Courses Offered</h2>
            <div className="grid gap-4">
              {college.courses?.map((course, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">{course.name}</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      ₹{course.fee?.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Duration:</strong> {course.duration}
                    </div>
                    <div>
                      <strong>Seats:</strong> {course.seats}
                    </div>
                    <div>
                      <strong>Eligibility:</strong> {course.eligibility}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placement Tab */}
        {activeTab === "placement" && college.placement && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Placement Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold text-green-600">
                  {college.placement.averagePackage}
                </p>
                <p className="text-gray-600">Average Package</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {college.placement.highestPackage}
                </p>
                <p className="text-gray-600">Highest Package</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {college.placement.topRecruiters?.length || 0}+
                </p>
                <p className="text-gray-600">Top Recruiters</p>
              </div>
            </div>

            {college.placement.topRecruiters && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Top Recruiters</h3>
                <div className="flex flex-wrap gap-3">
                  {college.placement.topRecruiters.map((recruiter, index) => (
                    <span key={index} className="bg-gray-100 px-4 py-2 rounded-lg">
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Facilities Tab */}
        {activeTab === "facilities" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Campus Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {college.facilities?.map((facility, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                  <span className="text-lg">🏢</span>
                  <h3 className="font-semibold mt-2">{facility}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
              <div className="space-y-6">
                {college.reviews?.map((review, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-2">★</span>
                        <span className="font-semibold">{review.stars}.0</span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <p className="text-sm text-gray-500">- User {review.user?.slice(-6)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Add Your Review</h3>
              <form onSubmit={handleAddReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <select
                    value={review.stars}
                    onChange={(e) =>
                      setReview({ ...review, stars: parseInt(e.target.value) })
                    }
                    className="w-full p-2 border rounded"
                  >
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {star} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    className="w-full p-2 border rounded h-24"
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Campus Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {college.images?.map((image, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={image.url}
                    alt={image.caption || "College campus"}
                    className="w-full h-48 object-cover rounded"
                  />
                  {image.caption && (
                    <p className="text-center mt-2 text-gray-600">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDetail;
