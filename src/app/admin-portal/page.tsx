// Front-End Code
"use client"
import React, { useState, useEffect } from 'react';
import { FiX, FiLogOut } from 'react-icons/fi';
import SplashScreen from '../../components/SplashScreen'
import axios from 'axios';

interface Client {
  clientid: number;
  name: string;
  email: string;
}

interface File {
  fileid: number;
  filename: string;
  filetype: string;
  filedata: string; // This should be adjusted according to your needs
}

const apiBaseUrl = 'http://localhost:3001';

export default function AdminPortal() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClientFiles, setSelectedClientFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);



  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');

    if (storedIsLoggedIn === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    axios.get(`${apiBaseUrl}/clients`)
      .then(response => {
        console.log('Fetched data:', response.data); // Add this line
        setClients(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching client information:', error);
      });
  }, []);

  const handleClientSelect = (client: Client) => {
    console.log('Selected Client:', client); // Add this line
    setSelectedClient(client);
    axios.get(`${apiBaseUrl}/files/${client.clientid}`)
      .then(response => {
        console.log('Client Files:', response.data); // Add this line
        setSelectedClientFiles(response.data);
      })
      .catch(error => {
        console.error('Error fetching client files:', error);
      });
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // Validate search term (e.g., check for allowed characters)
      const sanitizedSearchTerm = searchTerm.replace(/[^\w\s-]/g, ''); // Replace special characters

      axios.get(`${apiBaseUrl}/clients/search?name=${sanitizedSearchTerm}`)
        .then(response => {
          setClients(response.data);
        })
        .catch(error => {
          console.error('Error searching for clients:', error);
        });
    } else {
      // Fetch all clients when search bar is empty
      axios.get(`${apiBaseUrl}/clients`)
        .then(response => {
          setClients(response.data);
        })
        .catch(error => {
          console.error('Error fetching client information:', error);
        });
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Fetch all clients when search bar is empty
      axios.get(`${apiBaseUrl}/clients`)
        .then(response => {
          setClients(response.data);
        })
        .catch(error => {
          console.error('Error fetching client information:', error);
        });
    }
  }, [searchTerm]);
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };


  const downloadFile = (filename: string) => {
    axios.get(`${apiBaseUrl}/download/${encodeURIComponent(filename)}`, {
      responseType: 'blob', // Expect binary data
    })
      .then(response => {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Error downloading file:', error);
      });
  };

  const handleClientDelete = (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}? This will delete all associated files.`)) {
      axios.delete(`${apiBaseUrl}/clients/${client.clientid}`)
        .then(response => {
          // Refetch client data to update the list after deletion
          axios.get(`${apiBaseUrl}/clients`)
            .then(response => {
              setClients(response.data);
              setSelectedClient(null); // Clear selected client after deletion
              setSelectedClientFiles([]); // Clear selected client files after deletion
            })
            .catch(error => {
              console.error('Error fetching client information:', error);
            });
        })
        .catch(error => {
          console.error('Error deleting client:', error);
        });
    }
  };

  const handleCloseSelectedClient = () => {
    setSelectedClient(null);
    setSelectedClientFiles([]);
  };


  const handleLogin = () => {
    if (username === 'user' && password === '12345') {
      setIsLoggedIn(true);
      setLoginError(false);

      // Save login state to local storage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
    } else {
      setLoginError(true);
    }
  };


  const handleFileDelete = (file: File) => {
    if (window.confirm(`Are you sure you want to delete ${file.filename}?`)) {
      axios.delete(`${apiBaseUrl}/files/${file.fileid}`)
        .then(response => {
          // Refetch the client's files after deletion
          axios.get(`${apiBaseUrl}/files/${selectedClient?.clientid}`)
            .then(response => {
              setSelectedClientFiles(response.data);
            })
            .catch(error => {
              console.error('Error fetching client files:', error);
            });
        })
        .catch(error => {
          console.error('Error deleting file:', error);
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div className='h-screen p-4 bg-gray-100'>

      {isLoggedIn ? (
        <>
          {isLoading ? (
            <SplashScreen onLoadComplete={() => setIsLoading(false)} />
          ) : (
            <>
              <h1 className='text-4xl mb-4'>Client Information</h1>
              <div className='flex items-center mb-4'>
                <div className='flex flex-grow w-1/2'>
                  <input
                    type='text'
                    placeholder='Search by client name'
                    className='p-2 border rounded-l-md w-1/2'
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={handleSearchKeyPress}
                  />
                  <button
                    className='bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-300'
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
                <button className='ml-4 bg-red-500 flex items-center justify-center text-white p-3 rounded-md hover:bg-red-600 transition duration-300' onClick={handleLogout}>
                  Logout<FiLogOut size={20} className='ml-2' />
                </button>
              </div>
              <div className='flex'>
                {/* Clients Table */}
                <div className='flex-1 overflow-x-auto'>
                  <table className='min-w-full'>
                    <thead>
                      <tr className='bg-gray-300'>
                        <th className='py-2 px-4 text-center'>Client ID</th>
                        <th className='py-2 px-4 text-center'>Name</th>
                        <th className='py-2 px-4 text-center'>Email</th>
                        <th className='py-2 px-4 text-center'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(client => (
                        <tr
                          key={client.clientid}
                          onClick={() => handleClientSelect(client)}
                          className='cursor-pointer hover:bg-gray-100 transition duration-300'
                        >
                          <td className='py-2 px-4 text-center'>{client.clientid}</td>
                          <td className='py-2 px-4 text-center'>{client.name}</td>
                          <td className='py-2 px-4 text-center'>{client.email}</td>
                          <td className='py-2 px-4 text-center'>
                            <button
                              className='text-blue-500 hover:underline mr-2'
                              onClick={() => handleClientSelect(client)}
                            >
                              Select
                            </button>
                            <button
                              className='text-red-500 hover:underline'
                              onClick={() => handleClientDelete(client)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Client Files (fixed at the bottom) */}
              {selectedClient && (
                <div className='fixed bottom-0 left-0 right-0 p-6 bg-white shadow-md rounded-t-md'>
                  <button
                    className='absolute top-2 right-2 text-red-500 hover:underline'
                    onClick={handleCloseSelectedClient}
                  >
                    <FiX size={20} />
                  </button>
                  <h2 className='text-2xl mb-2 font-semibold'>Selected Client: {selectedClient.name}</h2>
                  <div className='flex flex-col max-h-80 overflow-y-auto'>
                    {/* Selected Client Files */}
                    <h3 className='text-xl mb-2 font-medium'>Client Files:</h3>
                    <div className='grid grid-cols-3 gap-4'>
                      {selectedClientFiles.map(file => (
                        <div key={file.fileid} className='p-4 border rounded-md'>
                          <div>{file.filename}</div>
                          <button
                            className='text-blue-500 hover:underline mt-2 mr-2'
                            onClick={() => downloadFile(file.filename)}
                          >
                            Download
                          </button>
                          <button
                            className='text-red-500 hover:underline mt-2'
                            onClick={() => handleFileDelete(file)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 shadow-md rounded-lg max-w-sm w-full">
            <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
            {loginError && (
              <p className="text-red-500 mb-2 text-center">Incorrect username or password</p>
            )}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 
