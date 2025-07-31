import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import MovieDetail from "./pages/MovieDetail";
import Booking from "./pages/Booking";
import TheatresShowsPage from "./pages/TheatresShowsPage";
import BookingSuccessPage from "./pages/BookingSuccess";
import "react-calendar/dist/Calendar.css";
import MyBookings from "./pages/myBooking";
import Watchlist from "./pages/Watchlist";
import MyProfile from "./pages/MyProfile";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import PartnerDashboard from "./pages/Partner";
import ProtectedRoute from "./components/ProtectedRoutes";
import UserProvider from './context/UserProvider';
import Loader from './components/Loader';
import { useUser } from './context/UserContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const noNavFooterPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const showNavFooter = !noNavFooterPaths.includes(location.pathname);

  return (
    <div className="AppLayout">
      {showNavFooter && <Navbar />}
      <main className="AppContent">{children}</main>
      {showNavFooter && <Footer />}
    </div>
  );
};

const AppContentWithLoader = () => {
    const { loading: userProviderLoading } = useUser();

    if (userProviderLoading) {
        return <Loader />;
    }
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/movie/:movieid" element={<MovieDetail />} />
                <Route
                    path="/movie/:movieid/shows"
                    element={<TheatresShowsPage />}
                />
                <Route path="/booking/:showId" element={<ProtectedRoute allowedRoles={['user', 'admin', 'partner']}><Booking /></ProtectedRoute>} />
                <Route
                    path="/booking-success/:bookingId"
                    element={<ProtectedRoute allowedRoles={['user', 'admin', 'partner']}><BookingSuccessPage /></ProtectedRoute>}
                />
                <Route path="/mybookings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'partner']}><MyBookings /></ProtectedRoute>} />
                <Route path="/my-watchlist" element={<ProtectedRoute allowedRoles={['user', 'admin', 'partner']}><Watchlist /></ProtectedRoute>} />
                <Route path="/my-profile" element={<ProtectedRoute allowedRoles={['user', 'admin', 'partner']}><MyProfile /></ProtectedRoute>} />

                <Route path="/partner-dashboard" element={<ProtectedRoute allowedRoles={['partner', 'admin']}><PartnerDashboard /></ProtectedRoute>} />
            </Routes>
        </Layout>
    );
};

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <UserProvider>
                    <AppContentWithLoader />
                </UserProvider>
            </BrowserRouter>
        </div>
    );
}


export default App;
