import { getPendingDoctors, getVerifiedDoctors } from '@/action/admin'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import PendingDoctors from './_component/pending-doctors';
import VerifiedDoctors from './_component/verified-doctors';

const AdminPage = async () => {

    const [pendingDoctorData, verifiedDoctorData] = await Promise.all([
        getPendingDoctors(),
        getVerifiedDoctors(),
    ]);

    return (
        <>
            <TabsContent
                value="pending"
                className='border-none p-0'
            >
                <PendingDoctors doctors={pendingDoctorData.doctors || []} />
            </TabsContent>

            <TabsContent
                value="doctors"
                className='border-none p-0'
            >
                <VerifiedDoctors doctors={verifiedDoctorData.doctors || []} />
            </TabsContent>
        </>
    );

}

export default AdminPage