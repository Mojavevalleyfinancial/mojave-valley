//Front-end Code
"use client"
import React, { useState } from 'react';
import axios from 'axios';

export default function FlTfr() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState('');

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Add visual indication that the drop area is valid
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Add visual indication that the drop area is valid
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Remove visual indication when leaving the drop area
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  async function handleUpload() {
    if (!files) {
      setMsg('No file selected');
      return;
    }
    if (!name || !email) {
      setMsg('Please enter your name and email');
      return;
    }

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append(`files`, files[i]);
    }

    fd.append('name', name);
    fd.append('email', email);

    setMsg('Uploading...');
    setProgress((prevState) => {
      return { ...prevState, started: true, pc: 0 };
    });

    // Send the files to the backend server
    try {
      // First, insert or retrieve client information
      const response = await axios.post('http://localhost:3001/upload', fd, {
        onUploadProgress: (progressEvent) => {
          const uploadedBytes = progressEvent.loaded;
          const totalBytes = progressEvent.total ?? 1; // Set a default value of 1 if total is undefined
          const uploadPercentage = (uploadedBytes / totalBytes) * 100;
          setProgress({ started: true, pc: uploadPercentage });
        },
      });
      setMsg('Upload Successful');
      console.log(response.data);
    } catch (error) {
      setMsg('Upload Failed');
      console.error(error);
    }
  }

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };



  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-4">Upload Files</h1>

      <div className="mb-2 md:w-1/2">
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500" type='text' value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="mb-2 pb-6 md:w-1/2">
        <label className="block text-sm font-medium text-gray-700">Email:</label>
        <input className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500" type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {/* <div className="mb-2"> */}
      {/*   <label className="block text-sm font-medium text-gray-700">Message:</label> */}
      {/*   <textarea className="mt-1 px-4 py-2 w-full h-24 border rounded-md resize-none focus:outline-none focus:ring focus:border-blue-500" value={message} onChange={(e) => setMessage(e.target.value)} /> */}
      {/* </div> */}

      <div
        className="mb-2 border-dashed border-2 border-gray-300 p-4 md:p-6 w-full md:w-1/2 rounded-md cursor-pointer text-center"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">Drag and Drop Files Here</label>
        <p className="text-gray-500 mb-2">Or</p>
        <label className="w-full px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Select Files
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newSelectedFiles = Array.from(e.target.files || []);
              setFiles((prevFiles) => [...prevFiles, ...newSelectedFiles]);
              setProgress({ started: false, pc: 0 });
              setMsg('');
            }}
            type="file"
            multiple
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="mt-4 text-gray-600">
            <p>{files.length} file(s) selected:</p>
            <ul className="list-disc pl-6">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between">
                  <span>{file.name}</span>
                  <button
                    className="text-red-600"
                    onClick={() => handleRemoveFile(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className="mt-4 w-full md:w-1/2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500" onClick={handleUpload}>Upload</button>

      {progress.started && <progress max={'100'} value={progress.pc} className="mt-4 w-full md:w-1/2 h-2 appearance-none bg-blue-200"></progress>}
      {msg && <span className="mt-2 text-center text-green-800">{msg}</span>}
    </div>
  );
}

