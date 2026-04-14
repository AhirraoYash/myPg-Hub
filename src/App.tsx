/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Users, CreditCard, Settings, Briefcase, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

// Screens
import HomeScreen from './screens/HomeScreen';
import TenantProfileScreen from './screens/TenantProfileScreen';
import RoomsScreen from './screens/RoomsScreen';
import AddTenantScreen from './screens/AddTenantScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import RecordPaymentScreen from './screens/RecordPaymentScreen';
import ComplaintsScreen from './screens/ComplaintsScreen';
import SettingsScreen from './screens/SettingsScreen';
import VerifyKYCScreen from './screens/VerifyKYCScreen';
import AgreementsScreen from './screens/AgreementsScreen';
import TenantListScreen from './screens/TenantListScreen';
import LoginScreen from './screens/LoginScreen';
import TeamScreen from './screens/TeamScreen';
import ManagePropertyScreen from './screens/ManagePropertyScreen';
import PrivacySecurityScreen from './screens/PrivacySecurityScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import ActivityLogScreen from './screens/ActivityLogScreen';
import NoticeAndSettlementScreen from './screens/NoticeAndSettlementScreen';

import TenantDashboardScreen from './screens/tenant/TenantDashboardScreen';
import TenantAccountsScreen from './screens/tenant/TenantAccountsScreen';
import TenantRaiseComplaintScreen from './screens/tenant/TenantRaiseComplaintScreen';
import TenantRoomScreen from './screens/tenant/TenantRoomScreen';
import TenantDocumentsScreen from './screens/tenant/TenantDocumentsScreen';
import TenantMoveOutScreen from './screens/tenant/TenantMoveOutScreen';
import TenantProfileScreen from './screens/tenant/TenantProfileScreen';
import TenantGatePassScreen from './screens/tenant/TenantGatePassScreen';

import ManagerDashboardScreen from './screens/manager/ManagerDashboardScreen';
import ManagerProfileScreen from './screens/manager/ManagerProfileScreen';

// ----------------------------------------------------------------------
// Navigation Components
// ----------------------------------------------------------------------

function NavItem({ to, icon: Icon, label, isActive = false }: { to: string, icon: any, label: string, isActive?: boolean }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform w-16 relative group">
      {isActive && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute -top-3 w-8 h-1 bg-blue-600 rounded-b-full"
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
      )}
      <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : 'group-hover:bg-gray-50'}`}>
        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
    </Link>
  );
}

// ----------------------------------------------------------------------
// Layouts (Simulating React Navigation Navigators)
// ----------------------------------------------------------------------

// Simulates @react-navigation/bottom-tabs
function TabLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center sm:p-4 font-sans">
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[800px] bg-[#f8f9fa] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative border-gray-300 sm:border-[8px]">
        
        {/* Screen Content */}
        <Outlet />

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
          <NavItem to="/" icon={Home} label="Home" isActive={location.pathname === '/'} />
          <NavItem to="/rooms" icon={Users} label="Rooms" isActive={location.pathname === '/rooms'} />
          <NavItem to="/team" icon={Briefcase} label="Team" isActive={location.pathname === '/team'} />
          <NavItem to="/payments" icon={CreditCard} label="Payments" isActive={location.pathname === '/payments'} />
          <NavItem to="/settings" icon={Settings} label="Settings" isActive={location.pathname === '/settings'} />
        </div>
      </div>
    </div>
  );
}

// Simulates @react-navigation/bottom-tabs for Manager
function ManagerTabLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center sm:p-4 font-sans">
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[800px] bg-[#f8f9fa] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative border-gray-300 sm:border-[8px]">
        
        {/* Screen Content */}
        <Outlet />

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
          <NavItem to="/" icon={Home} label="Home" isActive={location.pathname === '/'} />
          <NavItem to="/rooms" icon={Users} label="Rooms" isActive={location.pathname === '/rooms'} />
          <NavItem to="/tenants" icon={UserPlus} label="Tenants" isActive={location.pathname === '/tenants'} />
          <NavItem to="/complaints" icon={AlertCircle} label="Issues" isActive={location.pathname === '/complaints'} />
        </div>
      </div>
    </div>
  );
}

// Simulates @react-navigation/native Stack Navigator
function StackLayout() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center sm:p-4 font-sans">
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[800px] bg-[#f8f9fa] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative border-gray-300 sm:border-[8px]">
        {/* Screen Content (No Tabs) */}
        <Outlet />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main App Router
// ----------------------------------------------------------------------

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'owner' | 'manager' | 'tenant'>('owner');

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-200 flex items-center justify-center sm:p-4 font-sans">
          <div className="w-full max-w-[400px] h-[100dvh] sm:h-[800px] bg-[#f8f9fa] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative border-gray-300 sm:border-[8px]">
            <Routes>
              <Route path="/" element={<LoginScreen onLogin={(role) => { setIsAuthenticated(true); setUserRole(role); }} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  if (userRole === 'tenant') {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-200 flex items-center justify-center sm:p-4 font-sans">
          <div className="w-full max-w-[400px] h-[100dvh] sm:h-[800px] bg-[#f8f9fa] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col relative border-gray-300 sm:border-[8px]">
            <Routes>
              <Route path="/" element={<TenantDashboardScreen onLogout={() => setIsAuthenticated(false)} />} />
              <Route path="/tenant/accounts" element={<TenantAccountsScreen />} />
              <Route path="/tenant/complaints/new" element={<TenantRaiseComplaintScreen />} />
              <Route path="/tenant/room" element={<TenantRoomScreen />} />
              <Route path="/tenant/documents" element={<TenantDocumentsScreen />} />
              <Route path="/tenant/move-out" element={<TenantMoveOutScreen />} />
              <Route path="/tenant/profile" element={<TenantProfileScreen />} />
              <Route path="/tenant/gate-pass" element={<TenantGatePassScreen />} />
              <Route path="*" element={<TenantDashboardScreen onLogout={() => setIsAuthenticated(false)} />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  if (userRole === 'manager') {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<ManagerTabLayout />}>
            <Route path="/" element={<ManagerDashboardScreen />} />
            <Route path="/rooms" element={<RoomsScreen />} />
            <Route path="/tenants" element={<TenantListScreen />} />
            <Route path="/complaints" element={<ComplaintsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          
          <Route element={<StackLayout />}>
            <Route path="/manager/add-tenant" element={<AddTenantScreen />} />
            <Route path="/manager/record-payment" element={<RecordPaymentScreen />} />
            <Route path="/manager/profile" element={<ManagerProfileScreen onLogout={() => setIsAuthenticated(false)} />} />
            <Route path="/tenant/:id" element={<TenantProfileScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Tab Navigator Routes */}
        <Route element={<TabLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/rooms" element={<RoomsScreen />} />
          <Route path="/team" element={<TeamScreen />} />
          <Route path="/payments" element={<PaymentsScreen />} />
          <Route path="/settings" element={<SettingsScreen onLogout={() => setIsAuthenticated(false)} />} />
        </Route>

        {/* Stack Navigator Routes (Pushes over tabs) */}
        <Route element={<StackLayout />}>
          <Route path="/tenant/:id" element={<TenantProfileScreen />} />
          <Route path="/tenants" element={<TenantListScreen />} />
          <Route path="/add-tenant" element={<AddTenantScreen />} />
          <Route path="/record-payment" element={<RecordPaymentScreen />} />
          <Route path="/complaints" element={<ComplaintsScreen />} />
          <Route path="/verify-kyc" element={<VerifyKYCScreen />} />
          <Route path="/agreements" element={<AgreementsScreen />} />
          <Route path="/manage-property" element={<ManagePropertyScreen />} />
          <Route path="/privacy" element={<PrivacySecurityScreen />} />
          <Route path="/support" element={<HelpSupportScreen />} />
          <Route path="/activity" element={<ActivityLogScreen />} />
          <Route path="/settlement" element={<NoticeAndSettlementScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
