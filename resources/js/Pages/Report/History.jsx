import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyRequests({ auth, history }) {

    // Helper status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full border border-yellow-200">Pending</span>;
            case 'received': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full border border-blue-200">Received</span>;
            case 'rejected': return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full border border-red-200">Rejected</span>;
            case 'completed': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full border border-green-200">Completed</span>;
            default: return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full border border-gray-200">{status}</span>;
        }
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="รายการคำร้องของฉัน" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#F59E0B] pl-4">
                                    รายการคำร้องของฉัน (My Requests)
                                </h2>
                                <Link href={route('report.create')} className="px-4 py-2 bg-[#F59E0B] text-white rounded-md text-sm hover:bg-orange-600 transition">
                                    + แจ้งปัญหาใหม่
                                </Link>
                            </div>

                            {/* List */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Type</th>
                                            <th scope="col" className="px-6 py-3">Topic</th>
                                            <th scope="col" className="px-6 py-3">Location</th>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length > 0 ? (
                                            history.map((item, index) => (
                                                <tr key={index} className="bg-white border-b hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4">
                                                        {item.type === 'repair' ? (
                                                            <span className="text-orange-600 font-semibold flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                                                Repair
                                                            </span>
                                                        ) : (
                                                            <span className="text-indigo-600 font-semibold flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                                Complaint
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {item.title}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.building?.building_name || '-'} / {item.room?.room_name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(item.status)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                                    ยังไม่มีรายการแจ้งปัญหา
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
