
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type MotionCardProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    onClick?: () => void;
};

export function MotionCard({ children, className, delay = 0, onClick }: MotionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            onClick={onClick}
            className={cn("h-full", className)}
        >
            <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden bg-white/50 backdrop-blur-sm">
                {children}
            </Card>
        </motion.div>
    );
}

export const MotionContainer = motion.div;
export const MotionHeader = motion.header;
export const MotionSection = motion.section;
