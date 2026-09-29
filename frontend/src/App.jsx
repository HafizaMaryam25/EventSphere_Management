import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateExpo from './pages/admin/createExpo';
import ManageExpos from './pages/admin/ManageExpo';
import EditExpo from './pages/admin/EditExpo';
import AddBooths from './pages/admin/AddBooth';
import ManageBooths from './pages/admin/ManageBooths';
import UpdateBooth from './pages/admin/UpdateBooth';
import BookingRequests from './pages/admin/BookingRequest';
import TotalExpos from './pages/admin/TotalExpos';
import ExhibitorList from './pages/admin/ExhibitorList';
import ApprovedExhibitors from './pages/admin/ApprovedBooth';
import ManageSessions from './pages/admin/ManagementSession';
import CreateSession from './pages/admin/CreateSession';
import EditSession from './pages/admin/EditSession';
import ManageAttendees from './pages/admin/ManageAttendee';
import ManageFeedbacks from './pages/admin/ManageFeedbacks';

import Analytics from './pages/admin/Analytics';

import ExhibitorDashboard from './pages/Exhibitor/ExhibitorDashboard';
import CompanyProfile from './pages/Exhibitor/CompanyProfile';
import ExhibitorBooking from './pages/Exhibitor/ExhibitorBooking';
import MyBooths from './pages/Exhibitor/MyBooths';
import MyProducts from './pages/Exhibitor/MyProducts';
import AllChats from './pages/Exhibitor/AllChats';
import Home from './frontend/Home';
import About from './frontend/About';
import Features from './frontend/Features';
import Contact from './frontend/Contact';

import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
import ExploreExpos from './pages/attendee/AllExpo';
import ExpoDetails from './pages/attendee/ExpoDetail';
import MyTickets from './pages/attendee/MyTicket';
import AttendeeChat from './pages/attendee/Ateendeechat';
import FeedBack from './pages/attendee/FeedBack';
import Profile from './pages/attendee/Profile';
import MyBookmarks from './pages/attendee/MyBookmarks';
const LandingLayout = ({ children }) => (
  <div className="text-white font-landing min-h-screen flex flex-col" style={{background: 'radial-gradient(circle at top right, #773962 0%, #0f0518 60%, #1e0b36 100%)', backgroundAttachment: 'fixed'}}>
    {children}
  </div>
);

function App() {
  return (
    <>
      <ToastContainer theme="dark" position="top-right" />
      <Router>
        <ScrollToTop />
        <Routes>
  
          <Route path="/" element={<LandingLayout><Navigation /><Home /><Footer /></LandingLayout>} />
          <Route path="/about" element={<LandingLayout><Navigation /><About /><Footer /></LandingLayout>} />
          <Route path="/features" element={<LandingLayout><Navigation /><Features /><Footer /></LandingLayout>} />
          <Route path="/contact" element={<LandingLayout><Navigation /><Contact /><Footer /></LandingLayout>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          >
            <Route path='create-expo' element={<CreateExpo />}/>
            <Route path='manage-expo' element={<ManageExpos />}/>
            <Route path='edit-expo/:id' element={<EditExpo />}/>
            <Route path='add-booth' element={<AddBooths />}/>
            <Route path='manage-booth' element={<ManageBooths />}/>
            <Route path='update-booth/:id' element={<UpdateBooth />} />
            <Route path="booking-request" element={<BookingRequests />} />
            <Route path="total-expo" element={<TotalExpos />} />
            <Route path="exhibitor-list" element={<ExhibitorList />} />
            <Route path="approved-booth" element={<ApprovedExhibitors />} />
            <Route path="manage-attendees" element={<ManageAttendees />} />
            <Route path='manage-sessions' element={<ManageSessions />}/>
            <Route path="add-session" element={<CreateSession />} />
            <Route path="edit-session/:id" element={<EditSession />} />
            <Route path="feedbacks" element={<ManageFeedbacks />} />
            <Route path="analytics" element={<Analytics />} />
              <Route path='all-chats' element={<AllChats />}/>
          </Route>

          {/* Exhibitor Routes */}
          <Route 
            path="/exhibitor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Exhibitor']}>
                <ExhibitorDashboard/>
              </ProtectedRoute>
            } 
          >
            <Route path='add-profile' element={<CompanyProfile />}/>
            <Route path='Booth-Booking' element={<ExhibitorBooking />}/>
            <Route path='my-booth' element={<MyBooths />}/>
            <Route path='my-products' element={<MyProducts />}/>
            <Route path='all-chats' element={<AllChats />}/>
          </Route>

          {/* Attendee Routes */}
          <Route 
            path="/attendee/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Attendee']}>
                <AttendeeDashboard/>
              </ProtectedRoute>
            } 
          />
          <Route path="/attendee/explore" element={<ExploreExpos />} />
          <Route path="/tickets" element={<MyTickets />} />
          <Route path="/attendee/expo/:id" element={<ExpoDetails />} />
          <Route path="/attendee/messages" element={<AttendeeChat />} />
          <Route path="/support" element={<FeedBack type="General" />} />
          <Route path="/attendee/profile" element={<Profile />} />
          <Route path="/attendee/bookmarks" element={<MyBookmarks />} />
   <Route path="*" element={<div className="p-10 text-white text-center text-2xl font-bold">Page Not Found</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;