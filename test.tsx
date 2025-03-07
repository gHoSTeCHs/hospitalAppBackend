// import { hospitals } from './resources/js/constants/data';
// import { TableBody, TableCell, TableRow } from './resources/js/components/ui/table';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './resources/js/components/ui/tooltip';
// import {
//     DropdownMenu,
//     DropdownMenuContent, DropdownMenuItem,
//     DropdownMenuLabel, DropdownMenuSeparator,
//     DropdownMenuTrigger
// } from './resources/js/components/ui/dropdown-menu';
// import { Button } from './resources/js/components/ui/button';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle
// } from './resources/js/components/ui/dialog';
// import { Alert, AlertDescription, AlertTitle } from './resources/js/components/ui/alert';
//
//
// <TableBody>
//     {hospitals.map((hospital) => (
//         <TableRow key={hospital.id}>
//             <TableCell className="font-medium">{hospital.name}</TableCell>
//             <TableCell>{hospital.users.toLocaleString()}</TableCell>
//             <TableCell>{getStatusBadge(hospital.status)}</TableCell>
//             <TableCell>
//                 <TooltipProvider>
//                     <Tooltip>
//                         <TooltipTrigger>{getDocumentStatusBadge(hospital.documentsStatus)}</TooltipTrigger>
//                         <TooltipContent>
//                             <p>
//                                 {hospital.documentsUploaded
//                                     ? `Documents ${hospital.documentsStatus}`
//                                     : 'Documents not yet uploaded'}
//                             </p>
//                         </TooltipContent>
//                     </Tooltip>
//                 </TooltipProvider>
//             </TableCell>
//             <TableCell>{hospital.lastActivity}</TableCell>
//             <TableCell>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">Open menu</span>
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <circle cx="12" cy="12" r="1"></circle>
//                                 <circle cx="12" cy="5" r="1"></circle>
//                                 <circle cx="12" cy="19" r="1"></circle>
//                             </svg>
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem onClick={() => viewDocuments(hospital)} disabled={!hospital.documentsUploaded}>
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 className="mr-2"
//                             >
//                                 <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
//                                 <polyline points="14 2 14 8 20 8"></polyline>
//                             </svg>
//                             View Documents
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 className="mr-2"
//                             >
//                                 <path d="M12 20h9"></path>
//                                 <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
//                             </svg>
//                             Edit Details
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         {hospital.status === 'pending' && hospital.documentsStatus === 'approved' && (
//                             <DropdownMenuItem>
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="16"
//                                     height="16"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     className="mr-2 text-green-600"
//                                 >
//                                     <path d="M20 6 9 17l-5-5"></path>
//                                 </svg>
//                                 Approve Hospital
//                             </DropdownMenuItem>
//                         )}
//                         {hospital.status === 'active' && (
//                             <DropdownMenuItem>
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="16"
//                                     height="16"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     className="mr-2 text-amber-600"
//                                 >
//                                     <path d="M18 6 6 18"></path>
//                                     <path d="m6 6 12 12"></path>
//                                 </svg>
//                                 Deactivate
//                             </DropdownMenuItem>
//                         )}
//                         <DropdownMenuItem className="text-red-600">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 className="mr-2"
//                             >
//                                 <path d="M3 6h18"></path>
//                                 <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
//                                 <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
//                             </svg>
//                             Remove
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </TableCell>
//         </TableRow>
//     ))}
// </TableBody>
//
// <Dialog open={showDialog} onOpenChange={setShowDialog}>
//     <DialogContent>
//         <DialogHeader>
//             <DialogTitle>Hospital Documents</DialogTitle>
//             <DialogDescription>{selectedHospital && `Reviewing documents for ${selectedHospital.name}`}</DialogDescription>
//         </DialogHeader>
//
//         {selectedHospital && (
//             <>
//                 <div className="my-2 space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-1">
//                             <p className="text-sm font-medium text-gray-500">Hospital Name</p>
//                             <p>{selectedHospital.name}</p>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-sm font-medium text-gray-500">Location</p>
//                             <p>{selectedHospital.location}</p>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-sm font-medium text-gray-500">Join Date</p>
//                             <p>{selectedHospital.joinDate}</p>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-sm font-medium text-gray-500">Document Status</p>
//                             <p>{getDocumentStatusBadge(selectedHospital.documentsStatus)}</p>
//                         </div>
//                     </div>
//
//                     <div className="space-y-4 rounded-md border p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h4 className="font-medium">Hospital License</h4>
//                                 <p className="text-sm text-gray-500">Official operating license</p>
//                             </div>
//                             <div>
//                                 <Button variant="outline" size="sm">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         width="16"
//                                         height="16"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         className="mr-2"
//                                     >
//                                         <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                                         <polyline points="7 10 12 15 17 10"></polyline>
//                                         <line x1="12" y1="15" x2="12" y2="3"></line>
//                                     </svg>
//                                     Download
//                                 </Button>
//                             </div>
//                         </div>
//
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h4 className="font-medium">Insurance Documentation</h4>
//                                 <p className="text-sm text-gray-500">Liability coverage documents</p>
//                             </div>
//                             <div>
//                                 <Button variant="outline" size="sm">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         width="16"
//                                         height="16"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         className="mr-2"
//                                     >
//                                         <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                                         <polyline points="7 10 12 15 17 10"></polyline>
//                                         <line x1="12" y1="15" x2="12" y2="3"></line>
//                                     </svg>
//                                     Download
//                                 </Button>
//                             </div>
//                         </div>
//
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h4 className="font-medium">Administrative Contacts</h4>
//                                 <p className="text-sm text-gray-500">List of key staff members</p>
//                             </div>
//                             <div>
//                                 <Button variant="outline" size="sm">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         width="16"
//                                         height="16"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         className="mr-2"
//                                     >
//                                         <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                                         <polyline points="7 10 12 15 17 10"></polyline>
//                                         <line x1="12" y1="15" x2="12" y2="3"></line>
//                                     </svg>
//                                     Download
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {selectedHospital.documentsStatus === 'pending' && (
//                         <Alert>
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 className="h-4 w-4"
//                             >
//                                 <circle cx="12" cy="12" r="10"></circle>
//                                 <line x1="12" y1="8" x2="12" y2="12"></line>
//                                 <line x1="12" y1="16" x2="12.01" y2="16"></line>
//                             </svg>
//                             <AlertTitle>Documents Under Review</AlertTitle>
//                             <AlertDescription>These documents are currently being reviewed by the compliance team.</AlertDescription>
//                         </Alert>
//                     )}
//                 </div>
//
//                 <DialogFooter className="flex justify-between">
//                     {selectedHospital.documentsStatus === 'pending' && (
//                         <>
//                             <Button variant="destructive">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="16"
//                                     height="16"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     className="mr-2"
//                                 >
//                                     <path d="M18 6 6 18"></path>
//                                     <path d="m6 6 12 12"></path>
//                                 </svg>
//                                 Reject Documents
//                             </Button>
//                             <Button>
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="16"
//                                     height="16"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     className="mr-2"
//                                 >
//                                     <path d="M20 6 9 17l-5-5"></path>
//                                 </svg>
//                                 Approve Documents
//                             </Button>
//                         </>
//                     )}
//                     {selectedHospital.documentsStatus === 'approved' && selectedHospital.status === 'pending' && (
//                         <Button>
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 className="mr-2"
//                             >
//                                 <path d="M20 6 9 17l-5-5"></path>
//                             </svg>
//                             Approve Hospital
//                         </Button>
//                     )}
//                     {selectedHospital.documentsStatus === 'rejected' && (
//                         <Button variant="outline">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 className="mr-2"
//                             >
//                                 <path d="m3 2 18 24"></path>
//                                 <path d="M3 22m1-12H2"></path>
//                             </svg>
//                             Request New Documents
//                         </Button>
//                     )}
//                 </DialogFooter>
//             </>
//         )}
//     </DialogContent>
// </Dialog>
