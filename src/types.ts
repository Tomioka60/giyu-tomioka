/**
 * Types et modèles de données pour AgriIrrig
 * Conforme aux normes agronomiques marocaines (INRA Maroc, FAO-56, PNEI)
 */

export type GrowthStage = 'initial' | 'developpement' | 'mi_saison' | 'fin_saison';

export interface CropStageInfo {
  stage: GrowthStage;
  label: string;
  kc: number; // Coefficient cultural
  durationDaysApprox: number;
  description: string;
}

export interface Crop {
  id: string;
  name: string;
  category: 'arboriculture' | 'maraichage' | 'grandes_cultures' | 'fourrages' | 'fruits_rouges';
  rootDepthMeters: number; // Profondeur d'enracinement typique (m)
  depletionFractionP: number; // Fraction d'épuisement critique (p)
  stages: Record<GrowthStage, CropStageInfo>;
  notesAgro: string;
}

export interface MoroccanRegion {
  id: string;
  name: string;
  ormvaOrDpa: string; // ex: ORMVA Souss-Massa, ORMVA Gharb, DPA Saïss
  climateZone: string;
  // ET0 moyenne mensuelle (mm/jour) certifiée d'après les annales agro-climatiques DMN / INRA Maroc
  monthlyEt0: Record<number, number>; // 1 = Janvier, ..., 12 = Décembre
  typicalRainfallAnnualMm: number;
  principalCrops: string[];
}

export type SoilTypeKey = 'argileux_tirs' | 'limoneux_hamri' | 'sablo_limoneux_rmel' | 'caillouteux_alluvionnaire';

export interface MoroccanSoil {
  id: SoilTypeKey;
  name: string;
  localName: string; // Nom traditionnel marocain (Tirs, Hamri, Rmel, etc.)
  availableWaterCapacityMmPerM: number; // Réserve utile (RU en mm/mètre de sol)
  infiltrationRateMmPerHour: number; // Vitesse d'infiltration maximale (mm/h) pour éviter ruissellement
  advice: string;
}

export type IrrigationSystemType = 'goutte_a_goutte' | 'aspersion' | 'gravitaire_ameliore' | 'gravitaire_traditionnel';

export interface IrrigationSystem {
  id: IrrigationSystemType;
  name: string;
  defaultEfficiency: number; // en % (ex: 90)
  minEfficiency: number;
  maxEfficiency: number;
  flowUnitAdvised: 'm3_h' | 'l_s';
  description: string;
  pneiStatus: string; // Statut PNEI / Subventions FDA Maroc
}

export interface CalculationInput {
  parcelName: string;
  surfaceValue: number;
  surfaceUnit: 'ha' | 'm2';
  regionId: string;
  month: number; // 1-12
  cropId: string;
  growthStage: GrowthStage;
  customKc?: number; // si l'utilisateur modifie manuellement Kc
  soilId: SoilTypeKey;
  irrigationSystemId: IrrigationSystemType;
  customEfficiency?: number; // en %
  flowRate: number; // débit
  flowUnit: 'm3_h' | 'l_s'; // m³/h ou L/s
  et0: number; // mm/jour
  rainfall: number; // mm de pluie sur la journée/période
  actualDurationHours?: number; // durée réellement programmée par l'agriculteur (en heures décimales ou fraction)
  actualDurationMinutes?: number;
}

export interface CalculationResult {
  id: string;
  timestamp: string;
  input: CalculationInput;
  surfaceHa: number;
  surfaceM2: number;
  kc: number;
  et0: number;
  etc: number; // mm/jour = ET0 * Kc
  effectiveRainfall: number; // Peff (mm/jour)
  netRequirementMm: number; // Bn = max(0, ETc - Peff) (mm/jour)
  efficiency: number; // Ea (%)
  grossRequirementMm: number; // Bb = Bn / (Ea/100) (mm/jour)
  
  // Volumes
  volumeNeededM3: number; // Volume brut total d'eau nécessaire pour la parcelle (m³)
  volumeNetM3: number; // Volume net utile aux racines (m³)
  volumeLossesM3: number; // Pertes liées au système d'irrigation (m³)
  
  // Débit converti en m³/h
  flowRateM3h: number;
  
  // Durée d'irrigation recommandée
  recommendedDurationHours: number; // en heures décimales
  recommendedDurationFormatted: string; // ex: "3h 45min"
  
  // Volume réellement apporté (si durée saisie)
  actualVolumeM3?: number;
  
  // Bilan (Déficit ou Surplus)
  balanceM3?: number; // actualVolumeM3 - volumeNeededM3
  balanceStatus?: 'optimal' | 'deficit' | 'surplus' | 'non_specifie';
  balancePercentage?: number; // actualVolume / volumeNeeded * 100
  
  // Alertes agronomiques
  warnings: string[];
  recommendations: string[];
}
