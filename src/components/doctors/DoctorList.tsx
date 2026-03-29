
import { useState } from 'react';
import { useDoctorStore } from '@/stores/doctorStore';
import { Doctor } from '@/types/doctor';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DoctorForm } from './DoctorForm';
import { Plus, Pencil, Trash2, CalendarClock } from 'lucide-react';
import { DoctorScheduleManager } from './DoctorScheduleManager';
import { OPD_CONFIGS } from '@/types/clinic';
import { Badge } from '@/components/ui/badge';

export const DoctorList = () => {
    const { doctors, deleteDoctor } = useDoctorStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(undefined);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [scheduleDoctor, setScheduleDoctor] = useState<Doctor | undefined>(undefined);

    const handleEdit = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsOpen(true);
    };

    const handleCreate = () => {
        setSelectedDoctor(undefined);
        setIsOpen(true);
    };

    const handleSuccess = () => {
        setIsOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            deleteDoctor(id);
        }
    }

    const handleSchedule = (doctor: Doctor) => {
        setScheduleDoctor(doctor);
        setScheduleOpen(true);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Doctors Directory</h2>
                    <p className="text-muted-foreground">Manage doctor profiles, assignments and schedules.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Doctor
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Qualification</TableHead>
                            <TableHead>Specialization (OPD)</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No doctors found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            doctors.map((doctor) => (
                                <TableRow key={doctor.id}>
                                    <TableCell className="font-medium">{doctor.name}</TableCell>
                                    <TableCell>{doctor.qualification}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {doctor.specialization.map((spec) => {
                                                const config = OPD_CONFIGS.find(c => c.type === spec);
                                                return (
                                                    <Badge key={spec} variant="secondary" className="text-xs">
                                                        {config?.name || spec}
                                                    </Badge>
                                                )
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell>{doctor.contactNumber}</TableCell>
                                    <TableCell>
                                        <Badge variant={doctor.status === 'active' ? 'default' : 'destructive'}>
                                            {doctor.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleSchedule(doctor)} title="Manage Schedule">
                                                <CalendarClock className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(doctor.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
                    </DialogHeader>
                    <DoctorForm initialData={selectedDoctor} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Mange Schedule - {scheduleDoctor?.name}</DialogTitle>
                    </DialogHeader>
                    {scheduleDoctor && <DoctorScheduleManager doctor={scheduleDoctor} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};
