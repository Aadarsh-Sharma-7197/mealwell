import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChefHat,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  MapPin,
  DollarSign,
  Award,
  Calendar,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectReason, setRejectReason] = useState("");
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchQuery, statusFilter, applications]);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    if (!token || !adminData) {
      navigate("/admin/login");
      return;
    }
    setAdmin(JSON.parse(adminData));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/chef-applications/admin/all`,
        getAuthHeaders()
      );
      if (response.data.success) {
        setApplications(response.data.data);
        setFilteredApplications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.location.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this application?")) {
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/chef-applications/${id}/approve`,
        {},
        getAuthHeaders()
      );

      if (response.data.success) {
        alert("Application approved successfully!");
        fetchApplications();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application. Please try again.");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    if (!window.confirm("Are you sure you want to reject this application?")) {
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/chef-applications/${id}/reject`,
        { adminNotes: rejectReason },
        getAuthHeaders()
      );

      if (response.data.success) {
        alert("Application rejected");
        fetchApplications();
        setSelectedApplication(null);
        setRejectReason("");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending",
      value: applications.filter((app) => app.status === "pending").length,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Approved",
      value: applications.filter((app) => app.status === "approved").length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Rejected",
      value: applications.filter((app) => app.status === "rejected").length,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Chef Application Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {admin && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
                    <p className="text-xs text-gray-500">{admin.role}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or location..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-xl font-semibold transition ${
                    statusFilter === status
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid gap-6">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No applications found</p>
            </div>
          ) : (
            filteredApplications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <ChefHat className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-gray-900">{application.name}</h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ₹{application.pricePerMeal}/meal
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {application.experienceYears} years exp.
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium">{application.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm font-medium">{application.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cuisines</p>
                        <div className="flex flex-wrap gap-2">
                          {application.cuisines.map((cuisine, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Specialties</p>
                        <div className="flex flex-wrap gap-2">
                          {application.specialties.length > 0 ? (
                            application.specialties.map((spec, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {spec}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {application.bio && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Bio</p>
                        <p className="text-sm text-gray-700">{application.bio}</p>
                      </div>
                    )}

                    {application.signatureDishes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Signature Dishes</p>
                        <div className="flex flex-wrap gap-2">
                          {application.signatureDishes.map((dish, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {application.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(application._id)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setRejectReason("");
                          }}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Application Details</h2>
              <button
                onClick={() => {
                  setSelectedApplication(null);
                  setRejectReason("");
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="font-medium">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="font-medium">{selectedApplication.location}</p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Experience</p>
                    <p className="font-medium">{selectedApplication.experienceYears} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price per Meal</p>
                    <p className="font-medium">₹{selectedApplication.pricePerMeal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cuisines</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedApplication.cuisines.map((cuisine, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Specialties</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedApplication.specialties.length > 0 ? (
                        selectedApplication.specialties.map((spec, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {spec}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedApplication.bio && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-700">{selectedApplication.bio}</p>
                </div>
              )}

              {selectedApplication.signatureDishes.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Signature Dishes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.signatureDishes.map((dish, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedApplication.documents?.idProof && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">ID Proof</p>
                      <img
                        src={selectedApplication.documents.idProof}
                        alt="ID Proof"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                  {selectedApplication.documents?.kitchenPhoto && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Kitchen Photo</p>
                      <img
                        src={selectedApplication.documents.kitchenPhoto}
                        alt="Kitchen"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                  {selectedApplication.documents?.certificate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Certificate</p>
                      <img
                        src={selectedApplication.documents.certificate}
                        alt="Certificate"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {selectedApplication.status === "pending" && (
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows="3"
                      placeholder="Enter reason for rejection..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedApplication._id)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => handleReject(selectedApplication._id)}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </button>
                  </div>
                </div>
              )}

              {selectedApplication.adminNotes && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedApplication.adminNotes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

