import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, jobs }) {
    const getStatusBadge = (job) => {
        const steps = job.job_steps || [];
        const total = steps.length;
        const completed = steps.filter(s => s.status === 'completed').length;

        if (total === 0) return { text: 'ไม่มีขั้นตอน', color: 'bg-gray-100 text-gray-600' };
        if (completed === total) return { text: 'เสร็จสิ้น', color: 'bg-green-100 text-green-700' };
        if (completed > 0) return { text: `${completed}/${total} ขั้นตอน`, color: 'bg-blue-100 text-blue-700' };
        return { text: 'รอดำเนินการ', color: 'bg-orange-100 text-orange-700' };
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="ใบงานรวม" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-orange-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/25">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">ใบงานรวม</h1>
                                <p className="text-gray-500 text-sm">ใบงานที่คุณสร้างและมอบหมาย</p>
                            </div>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        {jobs.data.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-gray-500 font-medium">ยังไม่มีใบงานที่สร้าง</p>
                                <Link
                                    href={route('repairs.index')}
                                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    สร้างใบงานใหม่
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ใบงาน</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">คำขอที่เกี่ยวข้อง</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">สถานะ</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">วันที่สร้าง</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {jobs.data.map((job) => {
                                            const status = getStatusBadge(job);
                                            return (
                                                <tr key={job.job_id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-gray-900">{job.name}</div>
                                                        <div className="text-xs text-gray-500">JOB-{String(job.job_id).padStart(4, '0')}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {(job.repairs || []).slice(0, 3).map((repair) => (
                                                                <span key={repair.repair_id} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg">
                                                                    RP{String(repair.repair_id).padStart(4, '0')}
                                                                </span>
                                                            ))}
                                                            {(job.repairs || []).length > 3 && (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                                                                    +{job.repairs.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
                                                            {status.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(job.created_at).toLocaleDateString('th-TH', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Link
                                                            href={route('repairs.jobs.show', job.job_id)}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            ดูรายละเอียด
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {jobs.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
                                {jobs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${link.active
                                            ? 'bg-orange-500 text-white'
                                            : link.url
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
