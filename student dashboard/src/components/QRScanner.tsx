import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Camera, Upload, Square } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please make sure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // For demo purposes, we'll simulate QR detection
        // In a real app, you'd use a QR code detection library here
        const imageData = canvas.toDataURL();
        simulateQRDetection();
      }
    }
  };

  const simulateQRDetection = () => {
    // Simulate QR code detection for demo
    // In reality, you'd use a library like jsQR or qr-scanner
    const mockQRData = {
      type: 'attendance',
      date: new Date().toDateString(),
      sessionId: `session-${Date.now()}`,
      timestamp: Date.now()
    };
    
    onScan(JSON.stringify(mockQRData));
    stopCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, simulate successful scan
      simulateQRDetection();
    }
  };

  const handleManualInput = () => {
    // For demo purposes, create a valid QR data
    const mockQRData = {
      type: 'attendance',
      date: new Date().toDateString(),
      sessionId: `session-${Date.now()}`,
      timestamp: Date.now()
    };
    
    onScan(JSON.stringify(mockQRData));
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      {!isScanning ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Camera not active</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={startCamera} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
            
            <div className="relative">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload QR Image
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <Button 
              variant="secondary" 
              onClick={handleManualInput}
              className="w-full"
            >
              Simulate Scan (Demo)
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full max-w-sm mx-auto rounded-lg"
              autoPlay
              playsInline
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-white rounded-lg"></div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-2 justify-center">
            <Button onClick={captureFrame}>
              <Square className="h-4 w-4 mr-2" />
              Capture
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              Stop Camera
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Position the QR code within the frame and tap Capture
          </p>
        </div>
      )}
    </div>
  );
}