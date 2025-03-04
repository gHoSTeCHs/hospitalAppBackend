import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface StatProps {
    title: string;
    icon: string;
    description: string;
}

const GeneralStats = () => {
    const mockStats: StatProps[] = [
        {
            title: 'Users',
            icon: 'Hello',
            description: 'This is a description',
        },
    ];

    return (
        <div>
            {mockStats.map((stat: StatProps) => (
                <Card>
                    <CardHeader>
                        <CardTitle>{stat.title}</CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};

export default GeneralStats;
