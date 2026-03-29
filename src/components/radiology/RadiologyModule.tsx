
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadiologyOrders } from './RadiologyOrders';
import { RadiologyScheduling } from './RadiologyScheduling';
import { RadiologyWorklist } from './RadiologyWorklist';
import { RadiologyReporting } from './RadiologyReporting';
import { useRadiologyStore } from '@/stores/radiologyStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, FileText, Monitor } from 'lucide-react';

export function RadiologyModule() {
    const { orders, modalities, results, appointments } = useRadiologyStore();

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const activeModalities = modalities.filter(m => m.status === 'active').length;
    const reportsDone = results.length;
    const todayAppts = appointments.filter(a => a.status === 'scheduled').length;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Radiology Department</h1>
                    <p className="text-muted-foreground">Imaging appointments, acquistion, and reporting.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled Today</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayAppts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Modalities</CardTitle>
                        <Monitor className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeModalities}/{modalities.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reports Finalized</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reportsDone}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="orders" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="schedule">Scheduling</TabsTrigger>
                    <TabsTrigger value="worklist">Tech Worklist</TabsTrigger>
                    <TabsTrigger value="reporting">Reporting</TabsTrigger>
                </TabsList>

                <TabsContent value="orders">
                    <RadiologyOrders />
                </TabsContent>

                <TabsContent value="schedule">
                    <RadiologyScheduling />
                </TabsContent>

                <TabsContent value="worklist">
                    <RadiologyWorklist />
                </TabsContent>

                <TabsContent value="reporting">
                    <RadiologyReporting />
                </TabsContent>
            </Tabs>
        </div>
    );
}
