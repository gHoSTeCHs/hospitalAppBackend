import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VerifyHospitalService } from '@/services/hos-approval';
import { useEffect, useState } from 'react';
import { hospitals } from '@/constants/data';
import { HospitalApprovalProp } from '@/types';

const HospitalApproval = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<HospitalApprovalProp>();

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

    const viewDocuments = (hospital: HospitalApprovalProp) => {
        setSelectedHospital(hospital);
        setShowDialog(true);
    };

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const data = await VerifyHospitalService.getHospitals();
                console.log(data);
            } catch (e) {
                console.error(e);
            }
        };

        fetchHospitals();
    }, []);
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
                                <TableHead>Status</TableHead>
                                <TableHead>Documents</TableHead>
                                <TableHead>Last Activity</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hospitals.map((hospital) => (
                                <TableRow key={hospital.id}>
                                    <TableCell className="font-medium">{hospital.name}</TableCell>
                                    <TableCell>{hospital.users.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(hospital.status)}</TableCell>
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>{getDocumentStatusBadge(hospital.documentsStatus)}</TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {hospital.documentsUploaded
                                                            ? `Documents ${hospital.documentsStatus}`
                                                            : 'Documents not yet uploaded'}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>{hospital.lastActivity}</TableCell>
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
                                                <DropdownMenuItem onClick={() => viewDocuments(hospital)} disabled={!hospital.documentsUploaded}>
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
                                                <DropdownMenuItem>
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
                                                        <path d="M12 20h9"></path>
                                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                                                    </svg>
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {hospital.status === 'pending' && hospital.documentsStatus === 'approved' && (
                                                    <DropdownMenuItem>
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
                                                            className="mr-2 text-green-600"
                                                        >
                                                            <path d="M20 6 9 17l-5-5"></path>
                                                        </svg>
                                                        Approve Hospital
                                                    </DropdownMenuItem>
                                                )}
                                                {hospital.status === 'active' && (
                                                    <DropdownMenuItem>
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
                                                            className="mr-2 text-amber-600"
                                                        >
                                                            <path d="M18 6 6 18"></path>
                                                            <path d="m6 6 12 12"></path>
                                                        </svg>
                                                        Deactivate
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-red-600">
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
                                                        <path d="M3 6h18"></path>
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                    </svg>
                                                    Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
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
                                        <p>{selectedHospital.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Location</p>
                                        <p>{selectedHospital.location}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Join Date</p>
                                        <p>{selectedHospital.joinDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Document Status</p>
                                        <p>{getDocumentStatusBadge(selectedHospital.documentsStatus)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-md border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Hospital License</h4>
                                            <p className="text-sm text-gray-500">Official operating license</p>
                                        </div>
                                        <div>
                                            <Button variant="outline" size="sm">
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
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                Download
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Insurance Documentation</h4>
                                            <p className="text-sm text-gray-500">Liability coverage documents</p>
                                        </div>
                                        <div>
                                            <Button variant="outline" size="sm">
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
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                Download
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Administrative Contacts</h4>
                                            <p className="text-sm text-gray-500">List of key staff members</p>
                                        </div>
                                        <div>
                                            <Button variant="outline" size="sm">
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
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {selectedHospital.documentsStatus === 'pending' && (
                                    <Alert>
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
                                            className="h-4 w-4"
                                        >
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        <AlertTitle>Documents Under Review</AlertTitle>
                                        <AlertDescription>These documents are currently being reviewed by the compliance team.</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <DialogFooter className="flex justify-between">
                                {selectedHospital.documentsStatus === 'pending' && (
                                    <>
                                        <Button variant="destructive">
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
                                                <path d="M18 6 6 18"></path>
                                                <path d="m6 6 12 12"></path>
                                            </svg>
                                            Reject Documents
                                        </Button>
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
                                                <path d="M20 6 9 17l-5-5"></path>
                                            </svg>
                                            Approve Documents
                                        </Button>
                                    </>
                                )}
                                {selectedHospital.documentsStatus === 'approved' && selectedHospital.status === 'pending' && (
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
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        Approve Hospital
                                    </Button>
                                )}
                                {selectedHospital.documentsStatus === 'rejected' && (
                                    <Button variant="outline">
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
                                            <path d="m3 2 18 24"></path>
                                            <path d="M3 22m1-12H2"></path>
                                        </svg>
                                        Request New Documents
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HospitalApproval;
