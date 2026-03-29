
import { useState } from 'react';
import { Doctor, DoctorSchedule } from '@/types/doctor';
import { useDoctorStore } from '@/stores/doctorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { OPD_CONFIGS, OPDType } from '@/types/clinic';

interface DoctorScheduleManagerProps {
    doctor: Doctor;
}

const DAYS = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' },
];

export const DoctorScheduleManager = ({ doctor }: DoctorScheduleManagerProps) => {
    const { schedules, addSchedule, updateSchedule } = useDoctorStore();
    const [selectedDay, setSelectedDay] = useState<string>("1");

    // Helper to find existing schedule for a day/opd
    const getSchedule = (day: number, opdType: string) => {
        return schedules.find(s => s.doctorId === doctor.id && s.dayOfWeek === day && s.opdType === opdType);
    };

    const handleSave = (e: React.FormEvent, opdType: string, scheduleId?: string) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const data = {
            doctorId: doctor.id,
            opdType: opdType as OPDType,
            dayOfWeek: parseInt(selectedDay),
            startTime: formData.get('startTime') as string,
            endTime: formData.get('endTime') as string,
            slotDuration: parseInt(formData.get('slotDuration') as string),
            maxPatients: parseInt(formData.get('maxPatients') as string),
            isEmergencyOverride: formData.get('isEmergencyOverride') === 'on',
        };

        if (scheduleId) {
            updateSchedule(scheduleId, data);
        } else {
            addSchedule(data as any);
        }
        alert('Schedule saved!');
    };

    return (
        <div className="flex flex-col space-y-4">
            <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                    {DAYS.map(day => (
                        <TabsTrigger key={day.value} value={day.value.toString()}>
                            {day.label.slice(0, 3)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-4">
                    {DAYS.map(day => (
                        <TabsContent key={day.value} value={day.value.toString()} className="space-y-4">
                            <h3 className="text-lg font-medium">{day.label} Schedule</h3>

                            {doctor.specialization.map(opdType => {
                                const config = OPD_CONFIGS.find(c => c.type === opdType);
                                const schedule = getSchedule(day.value, opdType);

                                return (
                                    <Card key={opdType}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-xl">{config?.icon}</span>
                                                <h4 className="font-semibold">{config?.name}</h4>
                                            </div>

                                            <form onSubmit={(e) => handleSave(e, opdType, schedule?.id)} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                                <div className="space-y-2">
                                                    <Label>Start Time</Label>
                                                    <Input type="time" name="startTime" defaultValue={schedule?.startTime || "09:00"} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Time</Label>
                                                    <Input type="time" name="endTime" defaultValue={schedule?.endTime || "13:00"} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Slot (mins)</Label>
                                                    <Input type="number" name="slotDuration" defaultValue={schedule?.slotDuration || 15} min={5} step={5} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Max Patients</Label>
                                                    <Input type="number" name="maxPatients" defaultValue={schedule?.maxPatients || 20} />
                                                </div>

                                                <div className="flex items-center space-x-2 pt-4">
                                                    <Switch name="isEmergencyOverride" defaultChecked={schedule?.isEmergencyOverride} />
                                                    <Label>Emergency Slots</Label>
                                                </div>

                                                <div className="md:col-span-3 flex justify-end">
                                                    <Button type="submit" size="sm">Save {config?.name} Schedule</Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
};
