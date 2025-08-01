
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Tabs, Table, Button, Modal } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Loader from "../../components/Loader";
import 'react-calendar/dist/Calendar.css';

import {
  getPartnerTheatres,
  updatePartnerTheatre,
  deletePartnerTheatre,
  getPartnerTheatreShows,
  createPartnerShow,
  updatePartnerShow,
  deletePartnerShow,
  getPartnerTheatreBookings,
  getAllMoviesForSelection,
} from "../../services/partner";

import styles from "./partnerDashboard.module.css";

const { TabPane } = Tabs;

const PartnerDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);

  const [showModalVisible, setShowModalVisible] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movie: "",
    theatre: "",
    showDate: "",
    showTime: "",
    totalSeats: "",
    ticketPrice: "",
  });

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [theatresRes, showsRes, bookingsRes, moviesRes] = await Promise.all(
        [
          getPartnerTheatres(),
          getPartnerTheatreShows(),
          getPartnerTheatreBookings(),
          getAllMoviesForSelection(),
        ]
      );

      if (theatresRes.success) {
        setTheatres(theatresRes.data);
      } else {
        console.error("Failed to fetch theatres:", theatresRes.message);
        message.error(theatresRes.message || "Failed to load your theatres.");
      }

      if (showsRes.success) {
        setShows(showsRes.data);
      } else {
        console.error("Failed to fetch shows:", showsRes.message);
        message.error(showsRes.message || "Failed to load your shows.");
      }

      if (bookingsRes.success) {
        setBookings(bookingsRes.data);
      } else {
        console.error("Failed to fetch bookings:", bookingsRes.message);
        message.error(
          bookingsRes.message || "Failed to load bookings overview."
        );
      }

      if (moviesRes.success) {
        setMovies(moviesRes.data);
      } else {
        console.error(
          "Failed to fetch movies for selection:",
          moviesRes.message
        );
        message.error(
          moviesRes.message || "Failed to load movie list for show creation."
        );
      }

      if (
        !theatresRes.success ||
        !showsRes.success ||
        !bookingsRes.success ||
        !moviesRes.success
      ) {
        setError(
          "Some dashboard data failed to load. Please check console for details."
        );
      }
    } catch (err) {
      console.error("Unexpected error fetching partner dashboard data:", err);
      setError("An unexpected error occurred while loading dashboard data.");
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddShow = () => {
    setEditingShow(null);
    setFormData({
      movie: "",
      theatre: "",
      showDate: "",
      showTime: "",
      totalSeats: "",
      ticketPrice: "",
    });
    if (theatres.length === 1) {
      setFormData((prev) => ({ ...prev, theatre: theatres[0]._id }));
    }
    setShowModalVisible(true);
  };

  const handleEditShow = (record) => {
    setEditingShow(record);
    setFormData({
      movie: record.movie._id || "",
      theatre: record.theatre._id || "",
      showDate: record.showDate
        ? moment(record.showDate).format("YYYY-MM-DD")
        : "",
      showTime: record.showTime
        ? moment(record.showTime, "hh:mm A").format("HH:mm")
        : "",
      totalSeats: record.totalSeats || "",
      ticketPrice: record.ticketPrice || "",
    });
    setShowModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { movie, theatre, showDate, showTime, totalSeats, ticketPrice } =
      formData;
    if (
      !movie ||
      !theatre ||
      !showDate ||
      !showTime ||
      !totalSeats ||
      !ticketPrice
    ) {
      message.error("Please fill all required fields.");
      setLoading(false);
      return;
    }
    if (
      isNaN(totalSeats) ||
      totalSeats <= 0 ||
      isNaN(ticketPrice) ||
      ticketPrice <= 0
    ) {
      message.error("Total Seats and Ticket Price must be positive numbers.");
      setLoading(false);
      return;
    }

    const formattedShowTimeForBackend = moment(showTime, "HH:mm").format(
      "hh:mm A"
    );

    const dataToSend = {
      movie: movie,
      theatre: theatre,
      showDate: new Date(showDate).toISOString(),
      showTime: formattedShowTimeForBackend,
      totalSeats: Number(totalSeats),
      ticketPrice: Number(ticketPrice),
    };

    try {
      let response;
      if (editingShow) {
        response = await updatePartnerShow(editingShow._id, dataToSend);
      } else {
        response = await createPartnerShow(dataToSend);
      }

      if (response.success) {
        message.success(response.message);
        setShowModalVisible(false);
        fetchPartnerData();
      } else {
        message.error(response.message);
      }
    } catch (err) {
      console.error("Show form submission failed:", err);
      message.error(
        "Failed to save show: " + (err.message || "An error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModalVisible(false);
    setEditingShow(null);
    setFormData({
      movie: "",
      theatre: "",
      showDate: "",
      showTime: "",
      totalSeats: "",
      ticketPrice: "",
    });
  };

  const handleDeleteShow = (showId) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this show?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await deletePartnerShow(showId);
          if (response.success) {
            message.success(response.message);
            fetchPartnerData();
          } else {
            message.error(response.message);
          }
        } catch (err) {
          console.error("Error deleting show:", err);
          message.error("Failed to delete show.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const theatreColumns = [
    { title: "Theatre Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            type="link"
            onClick={() => message.info(`Managing shows for ${record.name}`)}
          >
            View Shows
          </Button>
        </span>
      ),
    },
  ];

  const showColumns = [
    { title: "Movie", dataIndex: ["movie", "movieName"], key: "movieName" },
    { title: "Theatre", dataIndex: ["theatre", "name"], key: "theatreName" },
    {
      title: "Date",
      dataIndex: "showDate",
      key: "showDate",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    { title: "Time", dataIndex: "showTime", key: "showTime" },
    { title: "Price", dataIndex: "ticketPrice", key: "ticketPrice" },
    { title: "Total Seats", dataIndex: "totalSeats", key: "totalSeats" },
    {
      title: "Booked Seats",
      dataIndex: "bookedSeats",
      key: "bookedSeats",
      render: (seats) => seats.length,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditShow(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteShow(record._id)}
            danger
          />
        </span>
      ),
    },
  ];

  const bookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.substring(0, 8) + "...",
    },
    { title: "Movie", dataIndex: ["show", "movie", "movieName"], key: "movie" },
    {
      title: "Theatre",
      dataIndex: ["show", "theatre", "name"],
      key: "theatre",
    },
    {
      title: "Date",
      dataIndex: ["show", "showDate"],
      key: "showDate",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    { title: "Time", dataIndex: ["show", "showTime"], key: "showTime" },
    {
      title: "Seats",
      dataIndex: "seats",
      key: "seats",
      render: (seats) => seats.join(", "),
    },
    { title: "Amount", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Booked By",
      dataIndex: ["user", "username"],
      key: "bookedBy",
      render: (username, record) => username || record.user?.email || "N/A",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.errorMessage}>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Partner Dashboard</h1>
      <p className={styles.dashboardSubtitle}>
        Manage your theatres, shows, and view bookings.
      </p>

      <Tabs defaultActiveKey="1" className={styles.dashboardTabs}>
        <TabPane tab="My Theatres" key="1">
          <div className={styles.tabContent}>
            {theatres.length === 0 ? (
              <p>
                You currently don't manage any theatres. Please contact an admin
                to assign one.
              </p>
            ) : (
              <Table
                columns={theatreColumns}
                dataSource={theatres}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                className={styles.dashboardTable}
              />
            )}
          </div>
        </TabPane>

        <TabPane tab="My Shows" key="2">
          <div className={styles.tabContent}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddShow}
              className={styles.addShowButton}
            >
              Add New Show
            </Button>
            {theatres.length === 0 ? (
              <p>
                You need to have a theatre assigned to add shows. Please contact
                an admin.
              </p>
            ) : shows.length === 0 ? (
              <p>
                No shows available for your theatres. Click "Add New Show" to
                get started.
              </p>
            ) : (
              <Table
                columns={showColumns}
                dataSource={shows}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className={styles.dashboardTable}
              />
            )}
          </div>
        </TabPane>

        <TabPane tab="Bookings Overview" key="3">
          <div className={styles.tabContent}>
            {bookings.length === 0 ? (
              <p>No bookings found for your theatres' shows yet.</p>
            ) : (
              <Table
                columns={bookingColumns}
                dataSource={bookings}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className={styles.dashboardTable}
              />
            )}
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title={editingShow ? "Edit Show" : "Add New Show"}
        visible={showModalVisible}
        onOk={handleFormSubmit}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        width={700}
        
        style={{ top: 100 }} 
        bodyStyle={{ height: 300, overflowY: "auto" }} 
        
        footer={[
          
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleFormSubmit}
          >
            {editingShow ? "Update Show" : "Add Show"}
          </Button>,
        ]}
      >
        <form onSubmit={handleFormSubmit} className={styles.customForm}>
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.formLabel}>
                <span className={styles.required}>*</span>Movie
              </label>
              <select
                name="movie"
                value={formData.movie}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.movieName} ({movie.language})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formCol}>
              <label className={styles.formLabel}>
                <span className={styles.required}>*</span>Theatre
              </label>
              <select
                name="theatre"
                value={formData.theatre}
                onChange={handleInputChange}
                className={styles.formSelect}
                disabled={theatres.length === 1 && !editingShow}
                required
              >
                <option value="">Select your theatre</option>
                {theatres.map((theatre) => (
                  <option key={theatre._id} value={theatre._id}>
                    {theatre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.formLabel}>
                <span className={styles.required}>*</span>Show Date
              </label>
              <input
                type="date"
                name="showDate"
                value={formData.showDate}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.formLabel}>
                <span className={styles.required}>*</span>Show Time
              </label>
              <input
                type="time"
                name="showTime"
                value={formData.showTime}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.formLabel}>
                <span className={styles.required}>*</span>Total Seats
              </label>
              <input
                type="number"
                name="totalSeats"
                min="1"
                value={formData.totalSeats}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., 150"
                required
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.formLabel}>
                <span className={styles.required}>*</span>Ticket Price (₹)
              </label>
              <input
                type="number"
                name="ticketPrice"
                min="1"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., 250"
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PartnerDashboard;
