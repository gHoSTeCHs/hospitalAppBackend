import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart, SquareTerminal } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { NavUser } from '@/pages/Admin/adminComponents/nav-user';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

// This is sample data.
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Dashboard',
            url: '/admin/dashboard',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
                {
                    title: 'Settings',
                    url: '#',
                },
            ],
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map,
        },
    ],
};

interface HospitalNameAndLogoProps {
    name: string;
    path: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<SharedData>().props;
    const [hospitalNameAndLogo, setHospitalNameAndLogo] = useState();

    useEffect(() => {
        const fetchHospitalDisplayDetails = async () => {
            try {
                const URL = `http://127.0.0.1:8000/admin/hospitals/${auth.user.id}`;
                const res = await fetch(URL);
                const data = await res.json();
                const parsedData = data[0];
                setHospitalNameAndLogo(parsedData);

                if (!res.ok) {
                    console.error('something went wrong');
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchHospitalDisplayDetails().then();
    }, [auth]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>

            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
