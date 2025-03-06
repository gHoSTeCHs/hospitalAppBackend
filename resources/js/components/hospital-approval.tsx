import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VerifyHospitalService } from '@/services/hos-approval';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
            case 'pending':
                return (
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-600">
                        Pending
                    </Badge>
                );
            case 'inactive':
                return (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Inactive
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getDocumentStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
            case 'pending':
                return (
                    <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-600">
                        Under Review
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                        Rejected
                    </Badge>
                );
            case 'missing':
                return (
                    <Badge variant="outline" className="border-gray-300 bg-gray-50 text-gray-600">
                        Not Uploaded
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getVerificationStatusBadge = (status: boolean) => {
        switch (status) {
            case true:
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
            case false:
                return (
                    <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-600">
                        Under Review
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const viewDocuments = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setShowDialog(true);
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
                                    {/*<div className="space-y-1">*/}
                                    {/*    <p className="text-sm font-medium text-gray-500">Join Date</p>*/}
                                    {/*    <p>{selectedHospital.joinDate}</p>*/}
                                    {/*</div>*/}
                                    {/*<div className="space-y-1">*/}
                                    {/*    <p className="text-sm font-medium text-gray-500">Document Status</p>*/}
                                    {/*    <p>{getDocumentStatusBadge(selectedHospital.documentsStatus)}</p>*/}
                                    {/*</div>*/}
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
                                                    {document.document_type == 'pending' ? (
                                                        <>
                                                            <Button>Approve</Button>
                                                        </>
                                                    ) : (
                                                        <>Approved</>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedHospital.verified ? <>Hospital is verified</> : <>Hospital is not verified</>}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HospitalApproval;
