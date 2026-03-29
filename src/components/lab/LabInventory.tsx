
import { useState } from 'react';
import { useLabStore } from '@/stores/labStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LabInventory() {
    const { inventory } = useLabStore();

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Reagents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory.filter(i => i.type === 'reagent').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Consumables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory.filter(i => i.type === 'consumable').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {inventory.filter(i => i.quantity <= i.reorderLevel).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inventory List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Reorder Level</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="capitalize">{item.type}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {item.quantity}
                                            {item.quantity <= item.reorderLevel && <AlertCircle className="h-4 w-4 text-orange-500" />}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{item.reorderLevel}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.quantity > item.reorderLevel ? 'outline' : 'destructive'}>
                                            {item.quantity > item.reorderLevel ? 'OK' : 'Low Stock'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
