import React, { useState } from 'react';
import { DoorClosed as Goose, Mic, X } from 'lucide-react';
import { Button } from './components/ui/button';

function App() {
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'recording' | 'verifying' | 'success' | 'error'>('idle');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setVerificationStatus('verifying');
        try {
          // Simulate goose sound verification
          const isGoose = Math.random() > 0.5; // Replace with actual API logic
          if (isGoose) {
            setVerificationStatus('success');
          } else {
            setVerificationStatus('error');
          }
        } catch (error) {
          console.error('Error verifying sound:', error);
          setVerificationStatus('error');
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setVerificationStatus('recording');
    } catch (error) {
      console.error('Error starting recording:', error);
      setVerificationStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="h-screen w-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Goose className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-800">GeeseQuacks</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Sign Up</Button>
            <Button variant="default">Login</Button>
          </div>
        </div>
      </div>

      {/* Map iframe */}
      <div className="h-full w-full">
        <iframe
          width="100%"
          height="100%"
          src="https://api.mapbox.com/styles/v1/jalencheng/cm6cpgq5j005101qo7qtrbbr8.html?title=false&access_token=pk.eyJ1IjoiamFsZW5jaGVuZyIsImEiOiJjbTZjcGF0aW8wbXBzMmtvYjJ3YTJlbW9pIn0.mnGbU-UywNpnmLto0kjg1g&zoomwheel=false#2.62/55.61/-87.21"
          title="Map"
          style={{ border: 'none' }}
        ></iframe>
      </div>

      {/* Report Button */}
      <div className="absolute bottom-8 right-8 z-10">
        <Button
          onClick={() => setShowReportPopup(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
        >
          <Goose className="w-5 h-5" />
          Report Goose Here!
        </Button>
      </div>

      {/* Record Sound Popup */}
      {showReportPopup && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Record Goose Sound</h3>
              <button
                onClick={() => {
                  setShowReportPopup(false);
                  setVerificationStatus('idle');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-8">
              {verificationStatus === 'idle' && (
                <div>
                  <p className="mb-4">Press the microphone to record the goose sound</p>
                  <Button
                    onClick={startRecording}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-4"
                  >
                    <Mic className="w-6 h-6" />
                  </Button>
                </div>
              )}

              {verificationStatus === 'recording' && (
                <div>
                  <p className="mb-4 text-red-500">Recording... Click to stop</p>
                  <Button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 animate-pulse"
                  >
                    <Mic className="w-6 h-6" />
                  </Button>
                </div>
              )}

              {verificationStatus === 'verifying' && (
                <div>
                  <p className="mb-4">Verifying sound...</p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                </div>
              )}

              {verificationStatus === 'success' && (
                <div className="text-green-500">
                  <p>Goose verified! Recording location...</p>
                  <div className="animate-pulse">
                    <Goose className="w-12 h-12 mx-auto mt-4" />
                  </div>
                </div>
              )}

              {verificationStatus === 'error' && (
                <div className="text-red-500">
                  <p>Could not verify goose sound. Please try again.</p>
                  <Button
                    onClick={() => setVerificationStatus('idle')}
                    className="mt-4"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
