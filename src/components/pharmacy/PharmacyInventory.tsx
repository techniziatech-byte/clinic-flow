
import { useState } from 'react';
import { usePharmacyStore } from '@/stores/pharmacyStore';
import { Medicine } from '@/types/pharmacy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PharmacyInventory() {
    const { medicines, searchMedicines, addMedicine, updateMedicine, deleteMedicine } = usePharmacyStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const filteredMedicines = searchQuery ? searchMedicines(searchQuery) : medicines;

    const [formData, setFormData] = useState<Partial<Medicine>>({
        name: '',
        category: 'tablet',
        sellingPrice: 0,
        currentStock: 0,
        reorderLevel: 10,
    });

    const handleSubmit = () => {
        if (!formData.name) return;

        if (editingId) {
            updateMedicine(editingId, formData);
        } else {
            addMedicine(formData as Medicine);
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ name: '', category: 'tablet', sellingPrice: 0, currentStock: 0, reorderLevel: 10 });
    };

    const handleEdit = (med: Medicine) => {
        setFormData(med);
        setEditingId(med.id);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure?")) deleteMedicine(id);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 w-full max-w-sm">
                    <Search className="w-4 h-4 text-muted-foreground my-auto" />
                    <Input
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingId(null); setFormData({}); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Medicine
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value as any })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price (PKR)</Label>
                                    <Input type="number" value={formData.sellingPrice || ''} onChange={e => setFormData({ ...formData, sellingPrice: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Stock</Label>
                                    <Input type="number" value={formData.currentStock || ''} onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reorder Level</Label>
                                    <Input type="number" value={formData.reorderLevel || ''} onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })} />
                                </div>
                            </div>
                            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Save'}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMedicines.map(med => (
                            <TableRow key={med.id}>
                                <TableCell className="font-medium">{med.name}<div className="text-xs text-muted-foreground">{med.genericName}</div></TableCell>
                                <TableCell className="capitalize">{med.category}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {med.currentStock}
                                        {med.currentStock <= med.reorderLevel && (
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>PKR {med.sellingPrice}</TableCell>
                                <TableCell>
                                    <Badge variant={med.currentStock > 0 ? 'default' : 'destructive'}>
                                        {med.currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(med)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(med.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
