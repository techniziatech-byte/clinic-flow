
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { OPDType, OPD_CONFIGS } from '@/types/clinic';
import { Doctor } from '@/types/doctor';
import { useDoctorStore } from '@/stores/doctorStore';
import { useState } from 'react';

const doctorSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    qualification: z.string().min(2, 'Qualification is required'),
    specialization: z.array(z.string()).min(1, 'Select at least one OPD'),
    registrationNumber: z.string().min(2, 'Registration number is required'),
    contactNumber: z.string().min(10, 'Valid contact number is required'),
    email: z.string().email('Invalid email'),
    roomNumber: z.string().optional(),
    isJunior: z.boolean().default(false),
});

interface DoctorFormProps {
    initialData?: Doctor;
    onSuccess: () => void;
}

export const DoctorForm = ({ initialData, onSuccess }: DoctorFormProps) => {
    const { addDoctor, updateDoctor } = useDoctorStore();

    const form = useForm<z.infer<typeof doctorSchema>>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            name: initialData?.name || '',
            qualification: initialData?.qualification || '',
            specialization: initialData?.specialization || [],
            registrationNumber: initialData?.registrationNumber || '',
            contactNumber: initialData?.contactNumber || '',
            email: initialData?.email || '',
            roomNumber: initialData?.roomNumber || '',
            isJunior: initialData?.isJunior || false,
        },
    });

    const onSubmit = (values: z.infer<typeof doctorSchema>) => {
        // Basic fee mapping logic (can be enhanced to simpler inputs per opd)
        const fees: Record<string, number> = {};
        values.specialization.forEach(spec => {
            const config = OPD_CONFIGS.find(opd => opd.type === spec);
            fees[spec] = initialData?.consultationFee?.[spec as OPDType] || config?.consultationFee || 500;
        });

        const doctorData = {
            ...values,
            specialization: values.specialization as OPDType[],
            consultationFee: fees as Record<OPDType, number>,
            status: initialData?.status || 'active',
            // If updating, preserve other fields, handled by store
        };

        if (initialData) {
            updateDoctor(initialData.id, doctorData as any);
        } else {
            addDoctor(doctorData as any);
        }
        onSuccess();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Doctor Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Dr. John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="qualification"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Qualification</FormLabel>
                                <FormControl>
                                    <Input placeholder="MBBS, FCPS" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="registrationNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PMDC / Reg No.</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345-A" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="0300-1234567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="doctor@hospital.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>OPD Assignment</FormLabel>
                            <div className="grid grid-cols-2 gap-2 border p-4 rounded-md">
                                {OPD_CONFIGS.map((opd) => (
                                    <FormField
                                        key={opd.type}
                                        control={form.control}
                                        name="specialization"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={opd.type}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(opd.type)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, opd.type])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== opd.type
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {opd.name}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isJunior"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Junior Doctor
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {initialData ? 'Update Doctor' : 'Add Doctor'}
                </Button>
            </form>
        </Form>
    );
};
