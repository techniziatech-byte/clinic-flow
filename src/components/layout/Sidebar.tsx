
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Stethoscope,
  Activity,
  Clock,
  FlaskConical,
  Pill,
  CreditCard,
  Settings,
  Menu,
  ChevronLeft,
  Hospital,
  UserCog,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useClinicStore } from '@/stores/clinicStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
  { id: 'registration', label: 'Registration', icon: UserPlus, roles: ['reception', 'admin', 'nurse'] },
  { id: 'queue', label: 'Queue Management', icon: Clock, roles: ['reception', 'admin', 'nurse', 'manager'] },
  { id: 'doctors', label: 'Doctor Management', icon: UserCog, roles: ['admin', 'manager', 'reception'] },
  { id: 'vitals', label: 'Vitals Station', icon: Activity, roles: ['nurse', 'junior-doctor', 'admin'] },
  { id: 'consultation', label: 'Consultation', icon: Stethoscope, roles: ['junior-doctor', 'consultant', 'admin'] },
  { id: 'lab', label: 'Laboratory', icon: FlaskConical, roles: ['lab', 'admin', 'pathologist'] },
  { id: 'radiology', label: 'Radiology', icon: Monitor, roles: ['radiologist', 'technician', 'admin'] },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill, roles: ['pharmacy', 'admin'] },
  { id: 'departments', label: 'Departments', icon: Hospital, roles: ['all'] },
  { id: 'billing', label: 'Billing', icon: CreditCard, roles: ['cashier', 'admin', 'manager'] },
];

const opdItems = [
  { id: 'opd-general', label: 'General Medicine', color: 'text-opd-general' },
  { id: 'opd-gynecology', label: 'Gynecology', color: 'text-opd-gynecology' },
  { id: 'opd-pediatrics', label: 'Pediatrics', color: 'text-opd-pediatrics' },
  { id: 'opd-cardiology', label: 'Cardiology', color: 'text-opd-cardiology' },
  { id: 'opd-ent', label: 'ENT', color: 'text-opd-ent' },
  { id: 'opd-dental', label: 'Dental', color: 'text-opd-dental' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const currentRole = 'admin'; // Fallback
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes('all') || item.roles.includes(currentRole)
  );

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-50 flex flex-col shadow-2xl",
        "bg-gradient-to-b from-slate-900 to-slate-950"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
            <Hospital className="h-6 w-6" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-bold text-lg tracking-tight">ClinicFlow</span>
                <span className="block text-xs text-sidebar-foreground/50 font-medium">Enterprise Health</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground/50 hover:text-white hover:bg-white/10"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-none custom-scrollbar">
        {/* Main Menu */}
        <div className="space-y-1">
          {!collapsed && <div className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2">Main Menu</div>}
          {filteredNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 relative z-10 transition-transform duration-200", isActive && "scale-110")} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium relative z-10 text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>

        {/* OPD Departments */}
        <div className="space-y-1">
          {!collapsed && (
            <>
              <Separator className="bg-white/10 my-4" />
              <div className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2">OPD Departments</div>
            </>
          )}
          {opdItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm",
                activeSection === item.id
                  ? "bg-white/10 text-white"
                  : "text-sidebar-foreground/60 hover:text-white hover:bg-white/5"
              )}
            >
              <div className={cn("h-2 w-2 rounded-full ring-2 ring-current ring-opacity-50", item.color)} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-sidebar-border/10">
        <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
            DR
          </div>
          {!collapsed && (
            <div className="text-left overflow-hidden">
              <div className="font-semibold text-sm truncate">Dr. Ayesha Malik</div>
currentRole.replace('-', ' ')
            </div>
          )}
          {!collapsed && <Settings className="h-4 w-4 ml-auto text-sidebar-foreground/40" />}
        </button>
      </div>
    </motion.aside>
  );
}
