import { HospitalApprovalProp } from '@/types';

export const mockTasks = [
    {
        id: 'TASK-8782',
        type: 'Documentation',
        title: "You can't compress the program without quantifying the open-source SSD...",
        status: 'In Progress',
        priority: 'Medium',
    },
    {
        id: 'TASK-7878',
        type: 'Documentation',
        title: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
        status: 'Backlog',
        priority: 'Medium',
    },
    {
        id: 'TASK-7839',
        type: 'Bug',
        title: 'We need to bypass the neural TCP card!',
        status: 'Todo',
        priority: 'High',
    },
    {
        id: 'TASK-5562',
        type: 'Feature',
        title: 'The SAS interface is down, bypass the open-source pixel so we can back ...',
        status: 'Backlog',
        priority: 'Medium',
    },
    {
        id: 'TASK-8686',
        type: 'Feature',
        title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
        status: 'Canceled',
        priority: 'Medium',
    },
    {
        id: 'TASK-1280',
        type: 'Bug',
        title: 'Use the digital TLS panel, then you can transmit the haptic system!',
        status: 'Done',
        priority: 'High',
    },
    {
        id: 'TASK-7262',
        type: 'Feature',
        title: 'The UTF8 application is down, parse the neural bandwidth so we can back...',
        status: 'Done',
        priority: 'High',
    },
    {
        id: 'TASK-1138',
        type: 'Feature',
        title: "Generating the driver won't do anything, we need to quantify the 1080p S...",
        status: 'In Progress',
        priority: 'Medium',
    },
    {
        id: 'TASK-7184',
        type: 'Feature',
        title: 'We need to program the back-end THX pixel!',
        status: 'Todo',
        priority: 'Low',
    },
    {
        id: 'TASK-5160',
        type: 'Documentation',
        title: "Calculating the bus won't do anything, we need to navigate the back-end ...",
        status: 'In Progress',
        priority: 'High',
    },
];

export const hospitals: HospitalApprovalProp[] = [
    {
        id: 1,
        name: 'General Hospital',
        users: 247,
        status: 'active',
        lastActivity: 'Today',
        documentsStatus: 'approved',
        documentsUploaded: true,
        location: 'San Francisco, CA',
        joinDate: 'Jan 15, 2025',
    },
    {
        id: 2,
        name: 'Memorial Health System',
        users: 195,
        status: 'active',
        lastActivity: 'Today',
        documentsStatus: 'approved',
        documentsUploaded: true,
        location: 'Chicago, IL',
        joinDate: 'Feb 28, 2025',
    },
    {
        id: 3,
        name: 'University Medical Center',
        users: 412,
        status: 'active',
        lastActivity: 'Yesterday',
        documentsStatus: 'pending',
        documentsUploaded: true,
        location: 'Boston, MA',
        joinDate: 'Dec 10, 2024',
    },
    {
        id: 4,
        name: "St. Mary's Hospital",
        users: 178,
        status: 'pending',
        lastActivity: '2 days ago',
        documentsStatus: 'pending',
        documentsUploaded: true,
        location: 'Austin, TX',
        joinDate: 'Feb 25, 2025',
    },
    {
        id: 5,
        name: 'Oceanview Medical Group',
        users: 97,
        status: 'pending',
        lastActivity: '3 days ago',
        documentsStatus: 'rejected',
        documentsUploaded: true,
        location: 'San Diego, CA',
        joinDate: 'Feb 20, 2025',
    },
    {
        id: 6,
        name: 'Riverdale Healthcare',
        users: 0,
        status: 'pending',
        lastActivity: 'N/A',
        documentsStatus: 'missing',
        documentsUploaded: false,
        location: 'Denver, CO',
        joinDate: 'Mar 1, 2025',
    },
];
