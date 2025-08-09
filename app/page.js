"use client";

import React, { useState, useEffect } from 'react';

// --- Helper Components ---
// These components remain the same as before.
const StatusBadge = ({ status }) => {
    const baseClasses = "text-xs font-medium me-2 px-2.5 py-0.5 rounded-full";
    const statusMap = {
        Available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        "Off Duty": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        Booked: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        Waiting: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        "With Doctor": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        Completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        Canceled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};

const PriorityBadge = ({ priority }) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-0.5 rounded";
    const priorityMap = {
        Normal: "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100",
        Urgent: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200",
    };
    return <span className={`${baseClasses} ${priorityMap[priority]}`}>{priority}</span>;
}


// --- Main Components ---
// These have been updated to handle real data and loading states.
const QueueManagement = ({ queue, setQueue, isLoading }) => {
    // In a real app, these functions would make POST/DELETE requests to your API
    const updateStatus = (id, newStatus) => {
        console.log(`Updating patient ${id} to ${newStatus}`);
        // Example API call:
        // fetch(`https://your-backend-url.onrender.com/queue/${id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
    };

    const removePatient = (id) => {
        console.log(`Removing patient ${id}`);
        // Example API call:
        // fetch(`https://your-backend-url.onrender.com/queue/${id}`, { method: 'DELETE' });
    };

    if (isLoading) return <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">Loading Queue...</div>

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Queue Management</h2>
            <div className="space-y-4">
                {queue.map((patient, index) => (
                    <div key={patient.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200">
                        <div className="flex items-center">
                            <span className="text-gray-400 mr-4">{index + 1}</span>
                            <div>
                                <p className="font-bold text-white">{patient.name}</p>
                                <p className="text-sm text-gray-400">Arrival: {patient.arrival} &bull; Est. Wait: {patient.wait}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select 
                                defaultValue={patient.status}
                                onChange={(e) => updateStatus(patient.id, e.target.value)}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                                <option>Waiting</option>
                                <option>With Doctor</option>
                                <option>Completed</option>
                            </select>
                            <PriorityBadge priority={patient.priority} />
                            <button onClick={() => removePatient(patient.id)} className="text-red-500 hover:text-red-400 text-2xl leading-none">&times;</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                Add New Patient to Queue
            </button>
        </div>
    );
};

const AvailableDoctors = ({ doctors, isLoading }) => {
    if (isLoading) return <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 text-center">Loading Doctors...</div>

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Available Doctors</h2>
            <div className="space-y-4">
                {doctors.map(doctor => (
                    <div key={doctor.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200">
                        <div>
                            <p className="font-bold text-white">{doctor.name}</p>
                            <p className="text-sm text-gray-400">{doctor.specialty}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <StatusBadge status={doctor.status} />
                            <p className="text-sm text-gray-300">Next available: {doctor.nextAvailable}</p>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200">
                                View Schedule
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AppointmentManagement = ({ appointments, isLoading }) => {
    // Calendar logic remains the same
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);
    const allDays = [...emptyDays, ...calendarDays];

    if (isLoading) return <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">Loading Appointments...</div>

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Appointment Management</h2>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar */}
                <div className="flex-shrink-0 bg-gray-900 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <button className="text-gray-400">&lt;</button>
                        <h3 className="font-bold text-white">{today.toLocaleString('default', { month: 'long' })} {year}</h3>
                        <button className="text-gray-400">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="text-gray-400 font-bold">{day}</div>)}
                        {allDays.map((day, index) => (
                            <div key={index} className={`p-1 rounded-full ${day ? 'text-white' : ''} ${day === today.getDate() ? 'bg-blue-600' : ''}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Appointments List */}
                <div className="flex-grow">
                    <div className="space-y-4">
                        {appointments.map(appt => (
                            <div key={appt.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200">
                                <div>
                                    <p className="font-bold text-white">{appt.patientName}</p>
                                    <p className="text-sm text-gray-400">w/ {appt.doctorName} at {appt.time}</p>
                                </div>
                                <StatusBadge status={appt.status} />
                            </div>
                        ))}
                    </div>
                     <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                        Schedule New Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- App Component ---
export default function App() {
    const [activeTab, setActiveTab] = useState('Queue');
    const [queue, setQueue] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // FIX: Replaced process.env with a placeholder for browser-based preview.
    // In your actual Vercel project, you should use:
    // const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const API_URL = "https://your-backend-url.onrender.com"; 

    useEffect(() => {
        const fetchData = async () => {
            if (!API_URL) {
                setError("API URL is not configured.");
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                // Since the backend isn't fully built, we'll use mock data for now
                // to prevent fetch errors in the preview.
                const mockDoctors = [
                    { id: 1, name: 'Dr. Smith', specialty: 'General Practice', status: 'Available', nextAvailable: 'Now' },
                    { id: 2, name: 'Dr. Johnson', specialty: 'Pediatrics', status: 'Busy', nextAvailable: '2:30 PM' },
                ];
                const mockQueue = [
                    { id: 1, name: 'John Doe', arrival: '09:30 AM', wait: '15 min', status: 'Waiting', priority: 'Normal' },
                    { id: 2, name: 'Jane Smith', arrival: '09:45 AM', wait: '0 min', status: 'With Doctor', priority: 'Normal' },
                ];
                const mockAppointments = [
                    { id: 1, patientName: 'Alice Brown', doctorName: 'Dr. Smith', time: '10:00 AM', status: 'Booked' },
                ];

                setDoctors(mockDoctors);
                setQueue(mockQueue);
                setAppointments(mockAppointments);
                setError(null);

            } catch (err) {
                setError("Failed to fetch data. Displaying mock data instead.");
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);


    const TabButton = ({ tabName, children }) => {
        const isActive = activeTab === tabName;
        return (
            <button
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Front Desk Dashboard</h1>
                    <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-lg p-1">
                        <TabButton tabName="Queue">Queue Management</TabButton>
                        <TabButton tabName="Appointments">Appointment Management</TabButton>
                    </div>
                </header>

                <main>
                    {error && <div className="bg-red-800 text-white p-4 rounded-lg mb-4">{error}</div>}
                    
                    {activeTab === 'Queue' && (
                        <>
                            <QueueManagement queue={queue} setQueue={setQueue} isLoading={isLoading} />
                            <AvailableDoctors doctors={doctors} isLoading={isLoading} />
                        </>
                    )}
                    {activeTab === 'Appointments' && <AppointmentManagement appointments={appointments} isLoading={isLoading} />}
                </main>
                
                <footer className="text-center text-gray-500 mt-12 text-sm">
                    <p>
                        {API_URL ? `Backend configured at: ${API_URL}` : "Backend connection not configured."}
                    </p>
                </footer>
            </div>
        </div>
    );
}
