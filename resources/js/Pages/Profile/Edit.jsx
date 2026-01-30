import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ตั้งค่าโปรไฟล์
                </h2>
            }
        >
            <Head title="ตั้งค่าโปรไฟล์" />

            <div className="py-8 lg:py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Profile Information Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Update Password Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <UpdatePasswordForm />
                    </div>

                    {/* Delete Account Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 sm:p-8">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
