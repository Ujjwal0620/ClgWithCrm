import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://getcollege-backend.onrender.com"; // Replace with production URL

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Management");

  const categories = [
    "Management",
    "Engineering",
    "Medical",
    "Science",
    "Arts",
    "Commerce",
    "Education",
    "Pharmacy",
    "Paramedical",
    "Law",
    "Design",
    "Agriculture",
  ];

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/exams`)
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Error fetching exams:", err));
  }, []);

  return (
    <div className="p-4 md:p-10 lg:px-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Top Exams</h2>
          <p className="text-gray-500 text-sm md:text-base">Exams cherry picked for you</p>
        </div>
        <button className="mt-3 md:mt-0 border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
          View All
        </button>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-blue-500 text-white font-medium border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            } transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.filter((exam) => exam.category === selectedCategory).map((exam) => (
          <div
            key={exam._id}
            className="bg-white border rounded-lg shadow-md hover:shadow-xl transition flex flex-col justify-between"
          >
            {/* Exam Header */}
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                {exam.logo && (
                  <img
                    src={exam.logo}
                    alt={exam.name}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-800">{exam.name}</h3>
              </div>
              <p className="text-gray-600 text-sm flex-grow">
                {exam.description?.substring(0, 120)}{exam.description?.length > 120 ? "..." : ""}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="border-t px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-blue-600 text-sm flex flex-wrap gap-3">
                {exam.cutoff && <span>● Cutoff</span>}
                {exam.answerKey && <span>● Answer Key</span>}
              </div>
              <Link
                to={`/exams/${exam.slug}`}
                className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-600 transition"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
        {exams.filter((exam) => exam.category === selectedCategory).length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No exams found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
