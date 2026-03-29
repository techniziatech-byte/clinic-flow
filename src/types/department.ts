
export interface Department {
    id: string;
    slug: string; // e.g., 'orthopaedics'
    name: string;
    icon: string; // Lucide icon name or emoji
    tagline: string;
    heroImage: string; // URL
    overview: string;
    diseasesTreated: string[];
    capabilities: string[];
    services: string[];
    procedures: string[];
    doctorIds: string[]; // Link to doctors in doctorStore
    technology: {
        name: string;
        description: string;
        image?: string;
    }[];
    patientCare: {
        protocols: string[];
        approach: string;
        rehabSupport: string;
    };
    contact: {
        phone: string;
        whatsapp: string;
        location: string;
    };
}
