import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import AdminDashboard from '@/Components/Groups/Admin/AdminDashboardContent';
import RepairDashboard from '@/Components/Groups/Repair/RepairDashboardContent';
import ComplaintDashboard from '@/Components/Groups/Complaint/ComplaintDashboardContent';
import LandingPage from '@/Components/Groups/LandingPage';

// Determine which view to show based on query param and strict permission
const DashboardContent = ({ view, user, urgentNews, generalNews, adminStats, recentActivity }) => {
    // Security Checks
    if (view === 'admin' && user.job_admin) return <AdminDashboard stats={adminStats} recentActivity={recentActivity} />;
    if (view === 'repair' && user.job_repair) return <RepairDashboard />;
    if (view === 'complaint' && user.job_complaint) return <ComplaintDashboard />;

    // Default fallback to LandingPage if view is invalid or permission denied
    return null;
};

export default function Dashboard() {
    const { auth, urgent_news, general_news, adminStats, recentActivity, warnings } = usePage().props;
    const user = auth.user;

    // Get URL query params
    const queryParams = new URLSearchParams(window.location.search);
    const view = queryParams.get('view');

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard" />

            <div className="">
                {/* Full Width Container Handling */}
                {!view ? (
                    <LandingPage urgentNews={urgent_news} generalNews={general_news} />
                ) : (
                    <div className="py-2">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <DashboardContent
                                view={view}
                                user={user}
                                urgentNews={urgent_news}
                                generalNews={general_news}
                                adminStats={adminStats}
                                recentActivity={recentActivity}
                                warnings={warnings}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
