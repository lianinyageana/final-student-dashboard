import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, CheckCircle, XCircle, BarChart3, TrendingUp } from 'lucide-react';
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

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  email: string;
  timestamp: string;
  date: string;
}

interface StudentAttendanceReportProps {
  user: User;
  onBack: () => void;
}

export function StudentAttendanceReport({ user, onBack }: StudentAttendanceReportProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [totalDays, setTotalDays] = useState(0);
  const [presentDays, setPresentDays] = useState(0);

  useEffect(() => {
    loadAttendanceHistory();
  }, [user.id]);

  const loadAttendanceHistory = () => {
    const records: AttendanceRecord[] = [];
    let totalClassDays = 0;
    
    // Get the last 30 days for demo purposes
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Check each day for attendance records
    for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateString = d.toDateString();
      const attendanceData = localStorage.getItem(`attendance-${dateString}`);
      
      if (attendanceData) {
        totalClassDays++;
        const dayAttendance = JSON.parse(attendanceData);
        const userRecord = dayAttendance.find((record: AttendanceRecord) => record.studentId === user.id);
        
        if (userRecord) {
          records.push(userRecord);
        }
      }
    }
    
    setAttendanceRecords(records);
    setTotalDays(Math.max(totalClassDays, records.length)); // Ensure total is at least the present days
    setPresentDays(records.length);
  };

  const getAttendancePercentage = () => {
    if (totalDays === 0) return 0;
    return Math.round((presentDays / totalDays) * 100);
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 75) return { status: 'Good', color: 'bg-green-100 text-green-700 border-green-200' };
    if (percentage >= 50) return { status: 'Warning', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { status: 'Poor', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  const attendancePercentage = getAttendancePercentage();
  const attendanceStatus = getAttendanceStatus(attendancePercentage);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1>My Attendance Report</h1>
              <p className="text-muted-foreground">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Total Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalDays}</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{presentDays}</p>
              <p className="text-xs text-muted-foreground">Days attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Percentage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{attendancePercentage}%</p>
              <Badge variant="outline" className={attendanceStatus.color}>
                {attendanceStatus.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Status Alert */}
        {attendancePercentage < 75 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-700">
              ⚠️ Your attendance is below 75%. Please ensure regular attendance to meet academic requirements.
            </AlertDescription>
          </Alert>
        )}

        {/* Recent Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>
              Your attendance history for the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length > 0 ? (
              <div className="space-y-3">
                {attendanceRecords
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 10)
                  .map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">Marked at {record.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                        Present
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attendance records found</p>
                <p className="text-sm text-muted-foreground">Start scanning QR codes to build your attendance history</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {attendanceRecords.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                  <p className="text-sm text-muted-foreground">Days Present</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{totalDays - presentDays}</p>
                  <p className="text-sm text-muted-foreground">Days Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}