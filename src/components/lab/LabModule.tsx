
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LabOrders } from './LabOrders';
import { LabSampleCollection } from './LabSampleCollection';
import { LabResults } from './LabResults';
import { LabInventory } from './LabInventory';
import { useLabStore } from '@/stores/labStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Beaker, CheckCircle, AlertTriangle } from 'lucide-react';

export function LabModule() {
  const { orders, samples, results } = useLabStore();

  // Dashboard Metrics
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingSamples = samples.filter(s => s.status === 'processing').length;
  const completedToday = results.length; // Simplified

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laboratory Management</h1>
          <p className="text-muted-foreground">Manage orders, samples, and results</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Beaker className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingSamples}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="samples">Sample Collection & Processing</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <LabOrders />
        </TabsContent>

        <TabsContent value="samples">
          <LabSampleCollection />
        </TabsContent>

        <TabsContent value="results">
          <LabResults />
        </TabsContent>

        <TabsContent value="inventory">
          <LabInventory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
