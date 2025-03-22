import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AssignmentUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const navigate = useNavigate();

  // Static assignment details
  const assignment = {
    title: 'Mathematics Assignment',
    description: 'Solve all the problems in Chapter 5 and submit your solutions.',
    deadline: 'March 30, 2024',
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    // Simulate file upload (replace with actual API call)
    setTimeout(() => {
      setUploadStatus('File uploaded successfully!');
      setFile(null); // Clear the file input
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">{assignment.title}</h1>
        <p className="text-gray-700 mb-4">{assignment.description}</p>
        <p className="text-gray-600 mb-6">
          <span className="font-semibold">Deadline:</span> {assignment.deadline}
        </p>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload your assignment:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Upload Button */}
        <Button onClick={handleUpload} className="w-full">
          Upload Assignment
        </Button>

        {/* Upload Status */}
        {uploadStatus && (
          <p className="mt-4 text-center text-sm text-gray-600">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentUpload;