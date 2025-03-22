import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreateAssignment: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAssignment = async () => {
    if (!title || !description || !deadline) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'assignments'), {
        title,
        description,
        deadline,
        classCode: 'ABC123', // Replace with dynamic class code
        uploads: {},
      });
      navigate('/'); // Redirect to home page after creation
    } catch (error) {
      setError('Error creating assignment.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Assignment</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateAssignment}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Assignment
        </button>
      </div>
    </div>
  );
};

export default CreateAssignment;