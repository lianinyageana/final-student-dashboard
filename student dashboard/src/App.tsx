import React, { useState } from 'react';
import { StudentDashboard } from './components/StudentDashboard';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'student';
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  email?: string;
  emailVerified?: boolean;
}

export default function App() {
  // Create a mock student user for demonstration
  const [user] = useState<User>({
    id: 'student-123',
    name: 'John A. Doe',
    role: 'student',
    firstName: 'John',
    lastName: 'Doe',
    middleInitial: 'A',
    email: 'john.doe@example.com',
    emailVerified: true
  });

  const handleLogout = () => {
    // For demo purposes, we'll just refresh the page
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentDashboard user={user} onLogout={handleLogout} />
    </div>
  );
}