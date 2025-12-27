

// import { Routes, Route } from 'react-router-dom';
// import { Layout } from './components/Layout';
// import { KanbanBoard } from './components/KanbanBoard';
// import { EquipmentList } from './components/EquipmentList';
// import { CalendarView } from './components/CalendarView';
// import { Dashboard } from './components/Dashboard';
// import { TeamsList } from './components/TeamsList'; // Import the new page!
// import { WorkCenterList } from './components/WorkCenterList';
// // import { LoginPage } from './components/LoginPage';
// // import { useUser } from './context/UserContext';

// function App() {
//   // const { user } = useUser();

//   // // If using Mock Auth
//   // if (!user) {
//   //   return <LoginPage />;
//   // }

//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<KanbanBoard />} />
//         <Route path="dashboard" element={<Dashboard />} />
//         <Route path="calendar" element={<CalendarView />} />
//         <Route path="equipment" element={<EquipmentList />} />
//         <Route path="work-centers" element={<WorkCenterList />} />
//         <Route path="teams" element={<TeamsList />} /> {/* Connect it here */}
//       </Route>
//     </Routes>
//   );
// }

// export default App;


import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { KanbanBoard } from './components/KanbanBoard';
import { EquipmentList } from './components/EquipmentList';
import { CalendarView } from './components/CalendarView';
import { Dashboard } from './components/Dashboard';
import { TeamsList } from './components/TeamsList';
import { WorkCenterList } from './components/WorkCenterList';

// Import New Pages & Store
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { useAuthStore } from './store/useAuthStore';

// Wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Wrapper to prevent logged-in users from seeing login page
const PublicRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
};

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES (No Layout) --- */}
      <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
      } />
      
      <Route path="/signup" element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
      } />

      {/* --- PROTECTED ROUTES (With Layout) --- */}
      <Route path="/" element={
          <ProtectedRoute>
             <Layout />
          </ProtectedRoute>
      }>
        <Route index element={<KanbanBoard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="equipment" element={<EquipmentList />} />
        <Route path="work-centers" element={<WorkCenterList />} />
        <Route path="teams" element={<TeamsList />} />
      </Route>
    </Routes>
  );
}

export default App;