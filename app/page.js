"use client";

import React, { useState, useEffect, useMemo } from 'react';

// --- Helper Components ---
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

// --- Modal Components ---
const NewPatientModal = ({ isOpen, onClose, onAddPatient }) => {
    const [patientName, setPatientName] = useState('');
    const [priority, setPriority] = useState('Normal');
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!patientName.trim()) return;
        onAddPatient({ name: patientName, priority });
        setPatientName('');
        setPriority('Normal');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Add New Patient to Queue</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="patientName" className="block text-sm font-medium text-gray-300 mb-1">Patient Name</label>
                        <input type="text" id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g., John Doe" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option>Normal</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Add Patient</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const NewAppointmentModal = ({ isOpen, onClose, onAddAppointment, doctors, patients }) => {
    const [patientName, setPatientName] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [time, setTime] = useState('10:00');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!patientName.trim() || !doctorId) return;
        const doctor = doctors.find(d => d.id === parseInt(doctorId));
        onAddAppointment({ patientName, doctorName: doctor.name, time: `${time} AM`, date });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Schedule New Appointment</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="apptPatientName" className="block text-sm font-medium text-gray-300 mb-1">Patient Name</label>
                        <input type="text" id="apptPatientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter patient name" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="doctor" className="block text-sm font-medium text-gray-300 mb-1">Doctor</label>
                        <select id="doctor" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                            <option value="">Select a doctor</option>
                            {doctors.filter(d => d.status === 'Available').map(d => <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>)}
                        </select>
                    </div>
                    <div className="mb-6 flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Schedule Appointment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Components ---
const QueueManagement = ({ queue, onAddPatient, onUpdatePatient, onDeletePatient, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddPatient = async (newPatientData) => {
        await onAddPatient(newPatientData);
        setIsModalOpen(false);
    };

    if (isLoading) return <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">Loading Queue...</div>

    return (
        <>
            <NewPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPatient={handleAddPatient} />
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
                                <select value={patient.status} onChange={(e) => onUpdatePatient(patient.id, { status: e.target.value })} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                                    <option>Waiting</option>
                                    <option>With Doctor</option>
                                    <option>Completed</option>
                                </select>
                                <PriorityBadge priority={patient.priority} />
                                <button onClick={() => onDeletePatient(patient.id)} className="text-red-500 hover:text-red-400 text-2xl leading-none">&times;</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Add New Patient to Queue</button>
            </div>
        </>
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
                            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200">View Schedule</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AppointmentManagement = ({ appointments, doctors, onAddAppointment, onDeleteAppointment, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);
    const allDays = [...emptyDays, ...calendarDays];

    const filteredAppointments = useMemo(() => {
        return appointments
            .filter(appt => appt.date === selectedDate)
            .filter(appt => appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [appointments, selectedDate, searchTerm]);

    const handleAddAppointment = async (newApptData) => {
        await onAddAppointment(newApptData);
        setIsModalOpen(false);
    };

    if (isLoading) return <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">Loading Appointments...</div>

    return (
        <>
            <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddAppointment={handleAddAppointment} doctors={doctors} />
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Appointment Management</h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="text-gray-400">&lt;</button>
                            <h3 className="font-bold text-white">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="text-gray-400">&gt;</button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="text-gray-400 font-bold">{day}</div>)}
                            {allDays.map((day, index) => {
                                const fullDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0] : '';
                                return (
                                    <div key={index} onClick={() => day && setSelectedDate(fullDate)} className={`p-1 rounded-full cursor-pointer ${day ? 'text-white hover:bg-blue-500' : ''} ${fullDate === selectedDate ? 'bg-blue-600' : ''}`}>
                                        {day}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex-grow">
                        <input type="text" placeholder="Search patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg w-full p-2.5 mb-4" />
                        <div className="space-y-4">
                            {filteredAppointments.length > 0 ? filteredAppointments.map(appt => (
                                <div key={appt.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200">
                                    <div>
                                        <p className="font-bold text-white">{appt.patientName}</p>
                                        <p className="text-sm text-gray-400">w/ {appt.doctorName} at {appt.time}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <StatusBadge status={appt.status} />
                                        <button onClick={() => onDeleteAppointment(appt.id)} className="text-red-500 hover:text-red-400 text-2xl leading-none">&times;</button>
                                    </div>
                                </div>
                            )) : <p className="text-gray-400">No appointments for this day.</p>}
                        </div>
                         <button onClick={() => setIsModalOpen(true)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Schedule New Appointment</button>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- App Component ---
export default function App() {
    const [activeTab, setActiveTab] = useState('Queue');
    const [data, setData] = useState({ queue: [], doctors: [], appointments: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // FIX: Replaced process.env with a placeholder for browser-based preview.
    // In your actual Vercel project, you should use:
    // const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const API_URL = "https://your-backend-url.onrender.com"; 

    const fetchData = async () => {
        // For the preview environment, we use mock data to avoid fetch errors.
        const mockDoctors = [
            { id: 1, name: 'Dr. Smith', specialty: 'General Practice', status: 'Available', nextAvailable: 'Now' },
            { id: 2, name: 'Dr. Johnson', specialty: 'Pediatrics', status: 'Busy', nextAvailable: '2:30 PM' },
            { id: 3, name: 'Dr. Lee', specialty: 'Cardiology', status: 'Off Duty', nextAvailable: 'Tomorrow 9:00 AM' },
            { id: 4, name: 'Dr. Patel', specialty: 'Dermatology', status: 'Available', nextAvailable: 'Now' },
        ];
        const mockQueue = [
            { id: 1, name: 'John Doe', arrival: '09:30 AM', wait: '15 min', status: 'Waiting', priority: 'Normal' },
            { id: 2, name: 'Jane Smith', arrival: '09:45 AM', wait: '0 min', status: 'With Doctor', priority: 'Normal' },
        ];
        const mockAppointments = [
            { id: 1, patientName: 'Alice Brown', doctorName: 'Dr. Smith', date: new Date().toISOString().split('T')[0], time: '10:00 AM', status: 'Booked' },
        ];
        setData({ doctors: mockDoctors, queue: mockQueue, appointments: mockAppointments });
        setIsLoading(false);

        // This is the actual fetch logic for your deployed app
        /*
        if (!API_URL) {
            setError("API URL is not configured.");
            setIsLoading(false);
            return;
        }
        
        try {
            const [doctorsRes, queueRes, appointmentsRes] = await Promise.all([
                fetch(`${API_URL}/doctors`),
                fetch(`${API_URL}/queue`),
                fetch(`${API_URL}/appointments`)
            ]);
            if (!doctorsRes.ok || !queueRes.ok || !appointmentsRes.ok) throw new Error('Failed to fetch data.');
            
            const doctorsData = await doctorsRes.json();
            const queueData = await queueRes.json();
            const appointmentsData = await appointmentsRes.json();

            setData({ doctors: doctorsData, queue: queueData, appointments: appointmentsData });
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
        */
    };

    useEffect(() => {
        fetchData();
    }, []); // Removed API_URL from dependency array for preview

    const apiCall = async (endpoint, method, body) => {
        // This is a placeholder for the real API call.
        // In the deployed app, this function would contain the fetch logic.
        console.log(`Mock API Call: ${method} to /${endpoint}`);
        // We will manipulate the local state directly for the preview.
    };
    
    const handleAddPatient = (patientData) => {
        const newPatient = { id: Math.random(), arrival: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), wait: '0 min', status: 'Waiting', ...patientData };
        setData(prev => ({...prev, queue: [...prev.queue, newPatient]}));
        // apiCall('queue', 'POST', patientData);
    };
    const handleUpdatePatient = (id, patientData) => {
        setData(prev => ({...prev, queue: prev.queue.map(p => p.id === id ? {...p, ...patientData} : p)}));
        // apiCall(`queue/${id}`, 'PATCH', patientData);
    };
    const handleDeletePatient = (id) => {
        setData(prev => ({...prev, queue: prev.queue.filter(p => p.id !== id)}));
        // apiCall(`queue/${id}`, 'DELETE');
    };
    const handleAddAppointment = (apptData) => {
        const newAppt = { id: Math.random(), status: 'Booked', ...apptData };
        setData(prev => ({...prev, appointments: [...prev.appointments, newAppt]}));
        // apiCall('appointments', 'POST', apptData);
    };
    const handleDeleteAppointment = (id) => {
        setData(prev => ({...prev, appointments: prev.appointments.filter(a => a.id !== id)}));
        // apiCall(`appointments/${id}`, 'DELETE');
    };

    const TabButton = ({ tabName, children }) => {
        const isActive = activeTab === tabName;
        return (
            <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
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
                            <QueueManagement queue={data.queue} onAddPatient={handleAddPatient} onUpdatePatient={handleUpdatePatient} onDeletePatient={handleDeletePatient} isLoading={isLoading} />
                            <AvailableDoctors doctors={data.doctors} isLoading={isLoading} />
                        </>
                    )}
                    {activeTab === 'Appointments' && <AppointmentManagement appointments={data.appointments} doctors={data.doctors} onAddAppointment={handleAddAppointment} onDeleteAppointment={handleDeleteAppointment} isLoading={isLoading} />}
                </main>
                <footer className="text-center text-gray-500 mt-12 text-sm">
                    <p>{API_URL ? `Backend configured` : "Backend connection not configured."}</p>
                </footer>
            </div>
        </div>
    );
}
