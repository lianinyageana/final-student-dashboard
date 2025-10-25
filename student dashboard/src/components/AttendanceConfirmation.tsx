import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Calendar, Clock, User, Mail } from 'lucide-react';
import { Badge } from './ui/badge';

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

interface AttendanceConfirmationProps {
  user: User;
  attendanceTime: string;
  onViewReport: () => void;
  onBackToDashboard: () => void;
}

export function AttendanceConfirmation({ 
  user, 
  attendanceTime, 
  onViewReport, 
  onBackToDashboard 
}: AttendanceConfirmationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Attendance Confirmed!</CardTitle>
          <CardDescription>
            Your attendance has been successfully recorded
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Student Info */}
          <div className="p-4 bg-white rounded-lg border space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Student Information</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Details */}
          <div className="p-4 bg-white rounded-lg border space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Attendance Details</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-sm font-medium">{attendanceTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Present
                </Badge>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 text-center">
              🎉 Great! You're marked present for today's class.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button onClick={onViewReport} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              View Attendance Report
            </Button>
            <Button variant="outline" onClick={onBackToDashboard} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}