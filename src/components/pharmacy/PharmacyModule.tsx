
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PharmacyInventory } from './PharmacyInventory';
import { PharmacyDispensing } from './PharmacyDispensing';
import { usePharmacyStore } from '@/stores/pharmacyStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package, TrendingUp, AlertCircle } from 'lucide-react';

export function PharmacyModule() {
  const { getLowStockMedicines, sales } = usePharmacyStore();
  const lowStock = getLowStockMedicines();

  // Quick Stats
  const totalSales = sales.reduce((acc, s) => acc + s.finalAmount, 0);
  const lowStockCount = lowStock.length;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Pharmacy Management</h1>

      <Tabs defaultValue="dispensing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dispensing">Dispensing Console</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Master</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PKR {totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Today's Sales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockCount}</div>
                <p className="text-xs text-muted-foreground">Medicines below reorder level</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dispensing">
          <PharmacyDispensing />
        </TabsContent>

        <TabsContent value="inventory">
          <PharmacyInventory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
