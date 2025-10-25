import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { QRScanner } from './QRScanner';
import { AttendanceConfirmation } from './AttendanceConfirmation';
import { StudentAttendanceReport } from './StudentAttendanceReport';
import { LogOut, Camera, CheckCircle, Clock, ShieldCheck, BarChart3 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

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

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [attendanceStatus, setAttendanceStatus] = useState<'not_marked' | 'marked' | 'error'>('not_marked');
  const [message, setMessage] = useState('');
  const [attendanceTime, setAttendanceTime] = useState<string>('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'confirmation' | 'report'>('dashboard');
  const [justMarkedAttendance, setJustMarkedAttendance] = useState(false);

  const checkTodayAttendance = () => {
    const today = new Date().toDateString();
    const attendanceData = localStorage.getItem(`attendance-${today}`);
    if (attendanceData) {
      const attendance = JSON.parse(attendanceData);
      const userAttendance = attendance.find((record: any) => record.studentId === user.id);
      if (userAttendance) {
        setAttendanceStatus('marked');
        setAttendanceTime(userAttendance.timestamp);
        setMessage('You have already marked attendance for today');
        return true;
      }
    }
    return false;
  };

  React.useEffect(() => {
    checkTodayAttendance();
  }, [user.id]);

  const handleQRScan = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      const today = new Date().toDateString();
      
      if (qrData.date !== today) {
        setAttendanceStatus('error');
        setMessage('This QR code is not valid for today');
        return;
      }

      // Check if already marked
      if (checkTodayAttendance()) {
        return;
      }

      // Mark attendance
      const timestamp = new Date().toLocaleString();
      const attendanceRecord = {
        studentId: user.id,
        studentName: user.name,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleInitial: user.middleInitial || '',
        email: user.email || '',
        timestamp,
        date: today
      };

      const existingData = localStorage.getItem(`attendance-${today}`);
      const attendanceArray = existingData ? JSON.parse(existingData) : [];
      attendanceArray.push(attendanceRecord);
      
      localStorage.setItem(`attendance-${today}`, JSON.stringify(attendanceArray));
      
      setAttendanceStatus('marked');
      setAttendanceTime(timestamp);
      setMessage('Attendance marked successfully!');
      setJustMarkedAttendance(true);
      setCurrentView('confirmation');
    } catch (error) {
      setAttendanceStatus('error');
      setMessage('Invalid QR code. Please scan the correct attendance QR code.');
    }
  };

  // Handle different views
  if (currentView === 'confirmation' && justMarkedAttendance) {
    return (
      <AttendanceConfirmation
        user={user}
        attendanceTime={attendanceTime}
        onViewReport={() => setCurrentView('report')}
        onBackToDashboard={() => {
          setCurrentView('dashboard');
          setJustMarkedAttendance(false);
        }}
      />
    );
  }

  if (currentView === 'report') {
    return (
      <StudentAttendanceReport
        user={user}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Camera className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1>Student Dashboard</h1>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">Welcome, {user.name}</p>
                {user.emailVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentView('report')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Report
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {attendanceStatus === 'marked' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Attendance Status
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-orange-500" />
                  Attendance Status
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Date</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={attendanceStatus === 'marked' ? 'default' : 'secondary'}>
                  {attendanceStatus === 'marked' ? 'Present' : 'Not Marked'}
                </Badge>
              </div>
            </div>
            
            {attendanceTime && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  Attendance marked at: {attendanceTime}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Scanner Section */}
        {attendanceStatus !== 'marked' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scan Attendance QR Code
              </CardTitle>
              <CardDescription>
                Point your camera at the QR code displayed by your instructor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QRScanner onScan={handleQRScan} />
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        {message && !justMarkedAttendance && (
          <Alert className={`mt-4 ${attendanceStatus === 'error' ? 'border-red-200 bg-red-50' : ''}`}>
            <AlertDescription className={attendanceStatus === 'error' ? 'text-red-700' : ''}>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}