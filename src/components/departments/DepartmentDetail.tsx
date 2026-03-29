
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useDoctorStore } from '@/stores/doctorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Calendar, MapPin, CheckCircle, ArrowRight, Microscope, Activity, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionContainer, MotionSection } from '@/components/ui/motion-card';

export function DepartmentDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { getDepartmentBySlug } = useDepartmentStore();
    const { doctors } = useDoctorStore();

    const department = getDepartmentBySlug(slug || '');
    const [activeTab, setActiveTab] = useState('overview');

    if (!department) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-gray-800">Department Not Found</h2>
                <Link to="/departments">
                    <Button variant="outline" className="mt-4">Back to Departments</Button>
                </Link>
            </div>
        );
    }

    // Filter doctors that belong to this department (mocking logic if ids missing)
    // Filter doctors that belong to this department (mocking logic if ids missing)
    const deptDoctors = doctors.filter(d =>
        d.specialization.some(s => s.toLowerCase() === department.slug.toLowerCase()) ||
        department.doctorIds.includes(d.id)
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <MotionContainer
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-[1600px] mx-auto pb-12"
        >
            {/* Hero Section */}
            <div className="relative h-[400px] w-full overflow-hidden rounded-b-3xl shadow-xl">
                <img
                    src={department.heroImage}
                    alt={department.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                    <div className="p-8 md:p-12 text-white w-full max-w-6xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Link to="/departments" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
                                <ArrowRight className="h-3 w-3 rotate-180" /> Back to Departments
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{department.name}</h1>
                            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light">{department.tagline}</p>

                            <div className="flex gap-4 mt-8">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-8 shadow-lg shadow-primary/20">
                                    Book Appointment
                                </Button>
                                <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md rounded-full">
                                    <Phone className="mr-2 h-4 w-4" /> {department.contact.phone}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Overview */}
                    <MotionSection variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="h-6 w-6 text-primary" /> About {department.name}
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg">{department.overview}</p>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <h3 className="font-semibold text-blue-900 mb-2">Diseases Treated</h3>
                                <ul className="space-y-1">
                                    {department.diseasesTreated.map((disease, i) => (
                                        <li key={i} className="flex items-center text-sm text-blue-800">
                                            <CheckCircle className="h-3 w-3 mr-2 opacity-50" /> {disease}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl">
                                <h3 className="font-semibold text-emerald-900 mb-2">Key Capabilities</h3>
                                <ul className="space-y-1">
                                    {department.capabilities.map((cap, i) => (
                                        <li key={i} className="flex items-center text-sm text-emerald-800">
                                            <CheckCircle className="h-3 w-3 mr-2 opacity-50" /> {cap}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </MotionSection>

                    {/* Specialities Tabs */}
                    <MotionSection variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <Tabs defaultValue="services" className="w-full">
                            <TabsList className="mb-6 w-full justify-start bg-slate-100 p-1 rounded-xl">
                                <TabsTrigger value="services" className="rounded-lg px-6">Services</TabsTrigger>
                                <TabsTrigger value="procedures" className="rounded-lg px-6">Procedures</TabsTrigger>
                                <TabsTrigger value="technology" className="rounded-lg px-6">Technology</TabsTrigger>
                            </TabsList>

                            <TabsContent value="services" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {department.services.map((service, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/30 transition-colors">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="font-medium text-gray-700">{service}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="procedures" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {department.procedures.map((proc, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/30 transition-colors bg-slate-50">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span className="font-medium text-gray-700">{proc}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="technology" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {department.technology.map((tech, i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <div className="h-32 bg-slate-200 w-full flex items-center justify-center text-slate-400">
                                            {tech.image ? <img src={tech.image} className="w-full h-full object-cover" /> : <Microscope className="h-10 w-10" />}
                                        </div>
                                        <CardContent className="p-4">
                                            <h4 className="font-bold text-gray-900">{tech.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{tech.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </MotionSection>

                    {/* Doctors */}
                    <MotionSection variants={itemVariants}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Our Specialists</h2>
                            <Button variant="link" className="text-primary">View All Doctors</Button>
                        </div>
                        {deptDoctors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {deptDoctors.map(doctor => (
                                    <div key={doctor.id} className="flex gap-4 p-4 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all">
                                        <div className="h-20 w-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                                            <img src={doctor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} alt={doctor.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-900">Dr. {doctor.name}</h3>
                                            <p className="text-primary text-sm font-medium">{doctor.specialization.join(', ')}</p>
                                            <p className="text-gray-500 text-xs mt-1">10+ years experience</p>
                                            <div className="mt-3 flex gap-2">
                                                <Button size="sm" className="rounded-full h-8 text-xs">Book Now</Button>
                                                <Button size="sm" variant="outline" className="rounded-full h-8 text-xs">Profile</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed text-gray-500">
                                <User className="h-12 w-12 mx-auto opacity-20 mb-2" />
                                <p>No doctors specifically assigned to this department yet.</p>
                            </div>
                        )}
                    </MotionSection>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <MotionSection variants={itemVariants} className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                            <Phone className="h-48 w-48" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 relative z-10">Contact Department</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg"><Phone className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs opacity-70">Emergency/Helpline</p>
                                    <p className="font-bold">{department.contact.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg"><Calendar className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs opacity-70">Appointment</p>
                                    <p className="font-bold">Book Online or Call</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg"><MapPin className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs opacity-70">Location</p>
                                    <p className="font-bold">{department.contact.location}</p>
                                </div>
                            </div>
                        </div>
                    </MotionSection>

                    <MotionSection variants={itemVariants} className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Patient Care
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">Safety Protocols</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{department.patientCare.protocols.join(', ')}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">Our Approach</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{department.patientCare.approach}</p>
                            </div>
                        </div>
                    </MotionSection>
                </div>
            </div>
        </MotionContainer>
    );
}
