import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VerifyHospitalService } from '@/services/hos-approval';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from './ui/dropdown-menu';

interface Document {
    id: number;
    hospital_id: number;
    document_title: string;
    document_type: string;
    path: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    hospital_id: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface Hospital {
    id: number;
    name: string | null;
    hospital_code: string;
    user_id: number;
    address: string;
    logo: string | null;
    created_at: string;
    updated_at: string;
    verified: boolean;
    users_count: number;
    documents: Document[];
    users: User[];
}

const HospitalApproval = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<Hospital>();
    const [hospitalData, setHospitalData] = useState<Hospital[]>([]);
    const [isVerifying, setIsVerifying] = useState(false);

    const getVerificationStatusBadge = (status: number | boolean) => {
        switch (status) {
            case 1:
            case true:
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
            case 0:
            case false:
                return (
                    <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-600">
                        Under Review
                    </Badge>
                );
            default:
                return <Badge variant="outline">{String(status)}</Badge>;
        }
    };

    const viewDocuments = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setShowDialog(true);
    };

    const verifyHospital = async (hospitalId: number) => {
        setIsVerifying(true);
        try {
            const response = await VerifyHospitalService.verifyHospital(hospitalId);

            setHospitalData((prevData) =>
                prevData.map((hospital) =>
                    hospital.id === hospitalId
                        ? {
                              ...hospital,
                              verified: true,
                          }
                        : hospital,
                ),
            );

            if (selectedHospital && selectedHospital.id === hospitalId) {
                setSelectedHospital({ ...selectedHospital, verified: true });
            }

            toast('The hospital has been successfully verified.');
        } catch (error) {
            console.error('Failed to verify hospital:', error);
            toast('There was an error verifying the hospital. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const data = await VerifyHospitalService.getHospitals();
                const parsedData = data[0];
                setHospitalData(parsedData);
            } catch (e) {
                console.error(e);
            }
        };

        fetchHospitals().then();
    }, []);

    useEffect(() => {
        if (hospitalData) {
            console.log(hospitalData);
        }
    }, [hospitalData]);

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Registered Hospitals</CardTitle>
                            <CardDescription>Manage all hospitals in the system</CardDescription>
                        </div>
                        <Button>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                            >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>
                            Add Hospital
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hospital Name</TableHead>
                                <TableHead>Users</TableHead>
                                <TableHead>Verification Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {hospitalData?.map((hospital) => {
                            return (
                                <TableRow key={hospital.id}>
                                    <TableCell className="font-medium">{hospital.name}</TableCell>
                                    <TableCell>{hospital.users_count.toLocaleString()}</TableCell>
                                    <TableCell>{getVerificationStatusBadge(hospital.verified)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="1"></circle>
                                                        <circle cx="12" cy="5" r="1"></circle>
                                                        <circle cx="12" cy="19" r="1"></circle>
                                                    </svg>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => viewDocuments(hospital)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="mr-2"
                                                    >
                                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                    </svg>
                                                    View Documents
                                                </DropdownMenuItem>
                                                {!hospital.verified && (
                                                    <DropdownMenuItem onClick={() => verifyHospital(hospital.id)}>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="mr-2"
                                                        >
                                                            <path d="M20 6 9 17l-5-5"></path>
                                                        </svg>
                                                        Verify Hospital
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <div className="text-xs text-gray-500">
                        Showing <strong>6</strong> out of <strong>124</strong> hospitals
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                            Previous
                        </Button>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hospital Documents</DialogTitle>
                        <DialogDescription>{selectedHospital && `Reviewing documents for ${selectedHospital.name}`}</DialogDescription>
                    </DialogHeader>
                    {selectedHospital && (
                        <>
                            <div className="my-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Hospital Name</p>
                                        {selectedHospital.name == null ? <p>No Name provided</p> : <p>{selectedHospital.name}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Location</p>
                                        {selectedHospital.address == null ? <p>No address provided</p> : <p>{selectedHospital.address}</p>}
                                    </div>
                                </div>
                                <div className="space-y-4 rounded-md border p-4">
                                    {selectedHospital.documents.map((document, id: number) => {
                                        let finalPath;
                                        finalPath = `${window.location.origin}/storage/${document.path}`;
                                        return (
                                            <div className="flex items-center justify-between" key={id}>
                                                <div>
                                                    <h4 className="font-medium">{document.document_title}</h4>
                                                    <p className="text-sm text-gray-500">Official operating license</p>
                                                </div>

                                                <div>
                                                    {document.path == null ? (
                                                        <>
                                                            <p>No document available</p>
                                                        </>
                                                    ) : (
                                                        <img alt="Document image" src={finalPath} className="h-10 w-10 rounded-lg" />
                                                    )}
                                                </div>
                                                <div>
                                                    {document?.document_type === 'pending' && document?.path ? (
                                                        <div className="flex gap-1">
                                                            <Button size="sm" className="text-xs">
                                                                Approve
                                                            </Button>
                                                            <Button variant="destructive" size="sm" className="text-xs">
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    ) : document?.document_type === 'rejected' ? (
                                                        <Button variant="destructive" disabled={true}>
                                                            Rejected
                                                        </Button>
                                                    ) : document?.document_type === 'approved' ? (
                                                        <p className="text-xs">Approved</p>
                                                    ) : (
                                                        <>Unknown Status</>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedHospital.verified ? (
                                <div className="flex items-center">
                                    <Badge className="mr-2 bg-green-100 text-green-800">Verified</Badge>
                                    <p>This hospital has been verified</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <p>Hospital is not verified</p>
                                    <Button variant="secondary" onClick={() => verifyHospital(selectedHospital.id)} disabled={isVerifying}>
                                        {isVerifying ? 'Verifying...' : 'Verify Hospital'}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HospitalApproval;
