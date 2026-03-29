
import { useDepartmentStore } from '@/stores/departmentStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionContainer, MotionSection } from '@/components/ui/motion-card';

export function DepartmentList() {
    const { departments } = useDepartmentStore();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <MotionContainer
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-[1600px] mx-auto p-6"
        >
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Centers of Excellence</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Combining the best specialists and equipment to provide you with comprehensive medical care.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {departments.map((dept) => (
                    <Link to={`/departments/${dept.slug}`} key={dept.id}>
                        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
                            <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={dept.heroImage}
                                        alt={dept.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <h3 className="text-white font-bold text-xl">{dept.name}</h3>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{dept.tagline}</p>
                                    <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                                        Explore Department <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </MotionContainer>
    );
}
