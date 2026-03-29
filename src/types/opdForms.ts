// OPD-specific clinical data types

// ============== GYNECOLOGY ==============
export interface GynecologyAssessment {
  id: string;
  visitId: string;
  // LMP & EDD
  lmp: string; // Last Menstrual Period
  edd: string; // Expected Delivery Date
  gestationalAge?: string;
  // Obstetric History (GPAL)
  gravida: number; // Total pregnancies
  para: number; // Live births
  abortions: number;
  living: number;
  // Menstrual History
  cycleLength: number;
  cycleDuration: number;
  cycleRegularity: 'regular' | 'irregular';
  dysmenorrhea: boolean;
  // Pregnancy Status
  isPregnant: boolean;
  trimester?: 1 | 2 | 3;
  // Risk Factors
  riskFactors: string[];
  // Clinical Notes
  chiefComplaint: string;
  clinicalNotes: string;
  diagnosis: string;
}

export interface GynLabOrders {
  cbc: boolean;
  hcg: boolean;
  hormonalProfile: boolean;
  thyroidProfile: boolean;
  urineRoutine: boolean;
  ultrasound: boolean;
  papSmear: boolean;
  other: string;
}

// ============== PEDIATRICS ==============
export interface PediatricsAssessment {
  id: string;
  visitId: string;
  // Age calculation
  dateOfBirth: string;
  ageYears: number;
  ageMonths: number;
  // Growth Parameters
  weight: number;
  height: number;
  headCircumference: number;
  weightPercentile?: number;
  heightPercentile?: number;
  bmi?: number;
  // Feeding History
  feedingType: 'breastfed' | 'formula' | 'mixed' | 'solid';
  feedingNotes: string;
  // Immunization
  bcg: boolean;
  opv: boolean;
  dpt: boolean;
  hepatitisB: boolean;
  mmr: boolean;
  varicella: boolean;
  immunizationNotes: string;
  // Developmental Milestones
  motorMilestones: string;
  languageMilestones: string;
  socialMilestones: string;
  // Clinical
  chiefComplaint: string;
  clinicalNotes: string;
  diagnosis: string;
}

export interface PedLabOrders {
  cbc: boolean;
  urineRoutine: boolean;
  stoolExam: boolean;
  bloodSugar: boolean;
  serumElectrolytes: boolean;
  other: string;
}

// ============== ENT ==============
export interface ENTAssessment {
  id: string;
  visitId: string;
  // Ear Examination
  earRight: {
    tympanic: 'normal' | 'perforated' | 'retracted' | 'bulging';
    discharge: boolean;
    hearing: 'normal' | 'reduced' | 'absent';
    notes: string;
  };
  earLeft: {
    tympanic: 'normal' | 'perforated' | 'retracted' | 'bulging';
    discharge: boolean;
    hearing: 'normal' | 'reduced' | 'absent';
    notes: string;
  };
  // Nose Examination
  nose: {
    septum: 'central' | 'deviated-left' | 'deviated-right';
    turbinates: 'normal' | 'hypertrophied' | 'atrophied';
    discharge: boolean;
    polyps: boolean;
    notes: string;
  };
  // Throat Examination
  throat: {
    tonsils: 'normal' | 'enlarged' | 'inflamed' | 'absent';
    pharynx: 'normal' | 'congested' | 'ulcerated';
    voice: 'normal' | 'hoarse' | 'aphonic';
    notes: string;
  };
  // Symptoms
  symptoms: {
    hearingLoss: boolean;
    tinnitus: boolean;
    vertigo: boolean;
    nasalBlock: boolean;
    sinusitis: boolean;
    snoring: boolean;
    soreThroat: boolean;
    dysphagia: boolean;
  };
  // Clinical
  chiefComplaint: string;
  clinicalNotes: string;
  diagnosis: string;
}

export interface ENTOrders {
  audiometry: boolean;
  tympanometry: boolean;
  endoscopy: boolean;
  ctScan: boolean;
  throatSwab: boolean;
  other: string;
}

// ============== DENTAL ==============
export interface DentalAssessment {
  id: string;
  visitId: string;
  // Tooth Charting (using FDI notation)
  toothChart: {
    [toothNumber: string]: {
      status: 'present' | 'missing' | 'decayed' | 'filled' | 'crown' | 'bridge' | 'implant';
      mobility?: 0 | 1 | 2 | 3;
      notes?: string;
    };
  };
  // Dental Complaints
  complaints: {
    pain: boolean;
    painLocation: string;
    bleeding: boolean;
    sensitivity: boolean;
    looseness: boolean;
    swelling: boolean;
    badBreath: boolean;
    other: string;
  };
  // Oral Hygiene
  oralHygiene: 'good' | 'fair' | 'poor';
  gumHealth: 'healthy' | 'gingivitis' | 'periodontitis';
  plaque: 'none' | 'minimal' | 'moderate' | 'heavy';
  // Planned Procedures
  procedures: {
    extraction: boolean;
    extractionTeeth: string;
    filling: boolean;
    fillingTeeth: string;
    scaling: boolean;
    rootCanal: boolean;
    rootCanalTeeth: string;
    crown: boolean;
    crownTeeth: string;
    other: string;
  };
  // Clinical
  chiefComplaint: string;
  clinicalNotes: string;
  diagnosis: string;
}

export interface DentalOrders {
  opg: boolean; // Orthopantomogram
  iopa: boolean; // Intraoral Periapical
  cbct: boolean;
  other: string;
}

// ============== GENERAL MEDICINE ==============
export interface GeneralMedicineAssessment {
  id: string;
  visitId: string;
  // System-wise Examination
  systemExam: {
    cardiovascular: { normal: boolean; notes: string };
    respiratory: { normal: boolean; notes: string };
    gastrointestinal: { normal: boolean; notes: string };
    neurological: { normal: boolean; notes: string };
    musculoskeletal: { normal: boolean; notes: string };
    genitourinary: { normal: boolean; notes: string };
    skin: { normal: boolean; notes: string };
  };
  // Chronic Diseases
  chronicConditions: {
    diabetes: boolean;
    hypertension: boolean;
    asthma: boolean;
    copd: boolean;
    thyroid: boolean;
    cardiac: boolean;
    renal: boolean;
    hepatic: boolean;
    other: string;
  };
  // Lifestyle
  lifestyle: {
    smoking: 'never' | 'current' | 'former';
    alcohol: 'never' | 'occasional' | 'regular' | 'heavy';
    exercise: 'sedentary' | 'light' | 'moderate' | 'active';
    diet: string;
    sleep: string;
  };
  // Allergies
  allergies: string;
  // Referral
  referralNeeded: boolean;
  referralTo?: string;
  // Clinical
  chiefComplaint: string;
  clinicalNotes: string;
  diagnosis: string;
}

export interface GeneralLabOrders {
  cbc: boolean;
  bloodSugar: boolean;
  lipidProfile: boolean;
  liverFunction: boolean;
  renalFunction: boolean;
  thyroidProfile: boolean;
  urineRoutine: boolean;
  ecg: boolean;
  chestXray: boolean;
  other: string;
}

// ============== CARDIOLOGY ==============
export interface CardiologyAssessment {
  id: string;
  visitId: string;
  // Chest Pain Assessment
  chestPain: {
    present: boolean;
    character: 'sharp' | 'dull' | 'pressure' | 'burning' | 'none';
    location: string;
    radiation: string;
    duration: string;
    triggers: string;
    reliefFactors: string;
    severity: number; // 1-10
  };
  // Cardiac Risk Factors
  riskFactors: {
    hypertension: boolean;
    diabetes: boolean;
    dyslipidemia: boolean;
    smoking: boolean;
    familyHistory: boolean;
    obesity: boolean;
    sedentaryLifestyle: boolean;
  };
  // Symptoms
  symptoms: {
    dyspnea: boolean;
    dyspneaClass: 'I' | 'II' | 'III' | 'IV' | 'none';
    palpitations: boolean;
    syncope: boolean;
    edema: boolean;
    fatigue: boolean;
    orthopnea: boolean;
    pnd: boolean; // Paroxysmal Nocturnal Dyspnea
  };
  // BP Trend
  bpReadings: {
    date: string;
    systolic: number;
    diastolic: number;
  }[];
  // Cardiac Examination
  cardiacExam: {
    heartRate: number;
    rhythm: 'regular' | 'irregular';
    heartSounds: 'normal' | 'murmur' | 'gallop';
    murmurGrade?: string;
    jvp: 'normal' | 'raised';
    peripheralPulses: 'present' | 'diminished' | 'absent';
    notes: string;
  };
  // Clinical
  chiefComplaint: string;
  clinicalNotes: string;
  diagnosis: string;
}

export interface CardiologyOrders {
  ecg: boolean;
  echo: boolean;
  tmt: boolean; // Treadmill Test
  holter: boolean;
  angiography: boolean;
  cardiacEnzymes: boolean;
  lipidProfile: boolean;
  bnp: boolean; // Brain Natriuretic Peptide
  dDimer: boolean;
  other: string;
}
