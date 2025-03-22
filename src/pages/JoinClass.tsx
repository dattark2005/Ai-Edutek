import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const JoinClass: React.FC = () => {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleJoinClass = async () => {
    if (!classCode) {
      setError('Please enter a class code.');
      return;
    }

    try {
      const classRef = doc(db, 'classes', classCode);
      await updateDoc(classRef, {
        students: arrayUnion(auth.currentUser?.uid), // Add student to the class
      });
      navigate('/'); // Redirect to home page after joining
    } catch (error) {
      setError('Invalid class code or unable to join class.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Join a Class</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Enter Class Code"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleJoinClass}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Join Class
        </button>
      </div>
    </div>
  );
};

export default JoinClass;

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}
