import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const HospitalActivities = () => {
    const activities = [
        {
            id: 1,
            type: 'hospital',
            title: 'New hospital onboarded',
            description: 'Memorial Health System was added to the platform',
            time: 'Today, 10:23 AM',
            icon: 'hospital',
            hospital: 'Memorial Health System',
        },
        {
            id: 2,
            type: 'report',
            title: 'Content reported',
            description: 'Inappropriate message reported in General Hospital group chat',
            time: 'Yesterday, 4:45 PM',
            icon: 'alert',
            hospital: 'General Hospital',
        },
        {
            id: 3,
            type: 'system',
            title: 'System update deployed',
            description: 'Version 2.4.0 with new messaging features',
            time: 'Mar 1, 2025, 3:12 PM',
            icon: 'update',
        },
        {
            id: 4,
            type: 'request',
            title: 'New feature request',
            description: 'Department-specific channels requested by University Medical Center',
            time: 'Feb 28, 2025, 11:30 AM',
            icon: 'message',
            hospital: 'University Medical Center',
        },
        {
            id: 5,
            type: 'user',
            title: 'User permission updated',
            description: 'Dr. Sarah Johnson granted admin access',
            time: 'Feb 27, 2025, 9:15 AM',
            icon: 'user',
            hospital: "St. Mary's Hospital",
        },
    ];

    const getIconComponent = (iconType: string) => {
        switch (iconType) {
            case 'hospital':
                return (
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
                        <path d="M19 3v12h-5c-.024 0-.047.008-.071.008a3.995 3.995 0 0 0-3.643 2.378A4.002 4.002 0 0 0 14 22a4 4 0 0 0 4-4"></path>
                        <path d="M5 3v18"></path>
                        <path d="M5 14h5"></path>
                        <path d="M5 9h3"></path>
                        <path d="M5 4h3"></path>
                    </svg>
                );
            case 'alert':
                return (
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                );
            case 'update':
                return (
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
                        <path d="M21 2v6h-6"></path>
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                        <path d="M3 22v-6h6"></path>
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                    </svg>
                );
            case 'message':
                return (
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
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                );
            case 'user':
                return (
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                );
            default:
                return null;
        }
    };

    const getActivityBadgeColor = (type: string) => {
        switch (type) {
            case 'hospital':
                return 'bg-blue-100 text-blue-800';
            case 'report':
                return 'bg-red-100 text-red-800';
            case 'system':
                return 'bg-green-100 text-green-800';
            case 'request':
                return 'bg-purple-100 text-purple-800';
            case 'user':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="">
            <Card className="w-full">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Activities</CardTitle>
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </div>
                    <CardDescription>Latest events across all hospitals</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <ScrollArea className="h-80 px-6">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-4 border-b py-4 last:border-0">
                                <Avatar className={`mt-1 ${getActivityBadgeColor(activity.type)}`}>
                                    <AvatarFallback className="bg-transparent">{getIconComponent(activity.icon)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center">
                                        <p className="text-sm font-medium">{activity.title}</p>
                                        {activity.hospital && (
                                            <Badge variant="outline" className="ml-2 text-xs font-normal">
                                                {activity.hospital}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                {/*<CardFooter className="flex justify-between border-t pt-4">*/}
                {/*    <Button variant="ghost" size="sm" className="text-xs text-gray-500">*/}
                {/*        <svg*/}
                {/*            xmlns="http://www.w3.org/2000/svg"*/}
                {/*            width="14"*/}
                {/*            height="14"*/}
                {/*            viewBox="0 0 24 24"*/}
                {/*            fill="none"*/}
                {/*            stroke="currentColor"*/}
                {/*            strokeWidth="2"*/}
                {/*            strokeLinecap="round"*/}
                {/*            strokeLinejoin="round"*/}
                {/*            className="mr-1"*/}
                {/*        >*/}
                {/*            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>*/}
                {/*            <polyline points="9 22 9 12 15 12 15 22"></polyline>*/}
                {/*        </svg>*/}
                {/*        Dashboard*/}
                {/*    </Button>*/}
                {/*    <Button variant="ghost" size="sm" className="text-xs text-gray-500">*/}
                {/*        <svg*/}
                {/*            xmlns="http://www.w3.org/2000/svg"*/}
                {/*            width="14"*/}
                {/*            height="14"*/}
                {/*            viewBox="0 0 24 24"*/}
                {/*            fill="none"*/}
                {/*            stroke="currentColor"*/}
                {/*            strokeWidth="2"*/}
                {/*            strokeLinecap="round"*/}
                {/*            strokeLinejoin="round"*/}
                {/*            className="mr-1"*/}
                {/*        >*/}
                {/*            <path d="M12 20v-6M9 17l3 3 3-3"></path>*/}
                {/*            <path d="M3 4h18M4 4v10a8 8 0 0 0 16 0V4"></path>*/}
                {/*        </svg>*/}
                {/*        Export*/}
                {/*    </Button>*/}
                {/*</CardFooter>*/}
            </Card>
        </div>
    );
};

export default HospitalActivities;
