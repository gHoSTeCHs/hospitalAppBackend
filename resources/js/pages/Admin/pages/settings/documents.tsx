import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/pages/Admin/adminComponents/app-sidebar';
import AdminSettings from '@/pages/Admin/layouts/settings/layout';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DocumentProps {
    id: number;
    hospital_id: number;
    document_title: string;
    document_type: string;
    path: string | File;
    created_at: string;
    updated_at: string;
}

const Documents = () => {
    const { auth } = usePage<SharedData>().props;
    const [documents, setDocuments] = useState<DocumentProps[]>([]);
    const [documentVerificationStatus, setDocumentVerificationStatus] = useState<string[]>([]);

    const { setData, post, errors } = useForm({
        corporate_affairs: null as File | null,
    });

    useEffect(() => {
        const checkDocumentsStatus = async () => {
            if (!auth.user.id) return;
            try {
                const URL = `http://127.0.0.1:8000/admin/hospitals/documents/${auth.user.id}`;
                const response = await fetch(URL);

                if (!response.ok) {
                    console.error('Something went wrong');
                }

                const data = await response.json();
                const parsedData = data[0] || [];

                setDocuments(parsedData);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        checkDocumentsStatus().then();
    }, [auth.user.id]);

    useEffect(() => {
        const verificationStatuses = documents.map((doc) => doc.document_type);
        setDocumentVerificationStatus(verificationStatuses);
    }, [documents]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, documentTitle: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setData(documentTitle.toLowerCase().replace(/\s+/g, '_'), file);
        }
    };

    const submitDocuments = () => {
        const id = auth.user.id;
        post(route('admin.hospital.documents.upload', id), {
            preserveScroll: true,
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AdminSettings>
                    <div className="space-y-6">
                        <HeadingSmall title="Hospital Verification Documents" description="Upload your hospital documents" />

                        {documentVerificationStatus.includes('pending') ? (
                            <div>
                                <div className="flex items-center space-x-2 rounded-md bg-yellow-50 p-4">
                                    <AlertTriangle color="orange" size={24} />
                                    <p className="text-yellow-700">Your documents are either not uploaded or pending verification</p>
                                </div>
                                <form
                                    className="mt-4 space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        submitDocuments();
                                    }}
                                    encType="multipart/form-data"
                                >
                                    {documents?.map((document, index) => (
                                        <div key={document.id} className="grid gap-2">
                                            <Label htmlFor={`document-${index}`}>{document.document_title}</Label>
                                            <Input
                                                id={`document-${index}`}
                                                type="file"
                                                accept="image/*,.pdf"
                                                className="mt-1 block w-full"
                                                onChange={(e) => handleFileUpload(e, document.document_title)}
                                            />
                                            <InputError message={errors.corporate_affairs} />
                                        </div>
                                    ))}
                                    <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                        Upload Documents
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="rounded-md bg-green-50 p-4 text-green-700">Your documents have been verified. You are good to go!</div>
                        )}
                    </div>
                </AdminSettings>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Documents;
