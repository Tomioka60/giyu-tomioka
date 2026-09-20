import { CalculationInput, CalculationResult } from '../types';
import { MOROCCAN_CROPS, MOROCCAN_REGIONS, MOROCCAN_SOILS, IRRIGATION_SYSTEMS } from '../data/moroccoData';

/**
 * Calcul de la pluie efficace (Peff) selon la méthodologie FAO / USDA-SCS
 * pour l'irrigation journalière
 */
export function calculateEffectiveRainfall(rainfallMm: number): number {
  if (rainfallMm <= 0) return 0;
  // Les très faibles pluies (< 3 mm) s'évaporent directement à la surface sans humidifier la rhizosphère
  if (rainfallMm < 3) {
    return Math.max(0, rainfallMm * 0.4);
  }
  // Pluies modérées : efficacité de 70% à 80%
  if (rainfallMm <= 20) {
    return Math.max(0, rainfallMm * 0.75 - 1.5);
  }
  // Grosses averses : plafonnement de l'infiltration
  return Math.min(rainfallMm * 0.65, 25);
}

/**
 * Convertit le débit en m³/h
 */
export function convertFlowToM3h(flowRate: number, unit: 'm3_h' | 'l_s'): number {
  if (unit === 'l_s') {
    return flowRate * 3.6; // 1 L/s = 3.6 m³/h
  }
  return flowRate;
}

/**
 * Formate une durée en heures décimales vers une chaîne lisible "X h Y min"
 */
export function formatDuration(hoursDecimal: number): string {
  if (!hoursDecimal || hoursDecimal <= 0) return '0 min';
  
  const totalMinutes = Math.round(hoursDecimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  if (minutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${minutes < 10 ? '0' : ''}${minutes} min`;
}

/**
 * Moteur principal de calcul des besoins en eau et durée d'irrigation
 */
export function calculateIrrigation(input: CalculationInput): CalculationResult {
  // 1. Détermination de la superficie en ha et en m²
  const surfaceHa = input.surfaceUnit === 'ha' ? input.surfaceValue : input.surfaceValue / 10000;
  const surfaceM2 = input.surfaceUnit === 'm2' ? input.surfaceValue : input.surfaceValue * 10000;

  // 2. Recherche des données de référence
  const crop = MOROCCAN_CROPS.find(c => c.id === input.cropId) || MOROCCAN_CROPS[0];
  const stageInfo = crop.stages[input.growthStage] || crop.stages.mi_saison;
  const region = MOROCCAN_REGIONS.find(r => r.id === input.regionId) || MOROCCAN_REGIONS[0];
  const soil = MOROCCAN_SOILS.find(s => s.id === input.soilId) || MOROCCAN_SOILS[0];
  const irrigationSystem = IRRIGATION_SYSTEMS.find(s => s.id === input.irrigationSystemId) || IRRIGATION_SYSTEMS[0];

  // 3. Coefficient cultural Kc et ET0
  const kc = typeof input.customKc === 'number' && input.customKc > 0 ? input.customKc : stageInfo.kc;
  const et0 = typeof input.et0 === 'number' && input.et0 > 0 ? input.et0 : (region.monthlyEt0[input.month] || 5.0);

  // 4. Évapotranspiration de la culture : ETc = ET0 * Kc (mm/jour)
  const etc = Number((et0 * kc).toFixed(2));

  // 5. Pluie efficace Peff (mm/jour)
  const effectiveRainfall = Number(calculateEffectiveRainfall(input.rainfall || 0).toFixed(2));

  // 6. Besoin net en eau : Bn = max(0, ETc - Peff) (mm/jour)
  const netRequirementMm = Number(Math.max(0, etc - effectiveRainfall).toFixed(2));

  // 7. Efficacité d'irrigation Ea
  const efficiency = typeof input.customEfficiency === 'number' && input.customEfficiency > 0 
    ? input.customEfficiency 
    : irrigationSystem.defaultEfficiency;

  // 8. Besoin brut en eau : Bb = Bn / (Ea / 100) (mm/jour)
  const grossRequirementMm = Number((netRequirementMm / (efficiency / 100)).toFixed(2));

  // 9. Volumes d'eau nécessaires (m³)
  // 1 mm sur 1 ha = 10 m³
  const volumeNeededM3 = Number((grossRequirementMm * surfaceHa * 10).toFixed(2));
  const volumeNetM3 = Number((netRequirementMm * surfaceHa * 10).toFixed(2));
  const volumeLossesM3 = Number(Math.max(0, volumeNeededM3 - volumeNetM3).toFixed(2));

  // 10. Débit disponible en m³/h
  const flowRateM3h = Number(convertFlowToM3h(input.flowRate, input.flowUnit).toFixed(2));

  // 11. Durée d'irrigation recommandée
  // Durée (h) = Volume (m³) / Débit (m³/h)
  const recommendedDurationHours = flowRateM3h > 0 ? Number((volumeNeededM3 / flowRateM3h).toFixed(3)) : 0;
  const recommendedDurationFormatted = formatDuration(recommendedDurationHours);

  // 12. Volume réellement apporté (si une durée programmée/réelle a été saisie)
  let actualVolumeM3: number | undefined;
  let balanceM3: number | undefined;
  let balanceStatus: 'optimal' | 'deficit' | 'surplus' | 'non_specifie' = 'non_specifie';
  let balancePercentage: number | undefined;

  const hasActualHours = typeof input.actualDurationHours === 'number';
  const hasActualMinutes = typeof input.actualDurationMinutes === 'number';

  if (hasActualHours || hasActualMinutes) {
    const hours = input.actualDurationHours || 0;
    const minutes = input.actualDurationMinutes || 0;
    const actualTotalHours = hours + (minutes / 60);

    if (actualTotalHours > 0 && flowRateM3h > 0) {
      actualVolumeM3 = Number((flowRateM3h * actualTotalHours).toFixed(2));
      balanceM3 = Number((actualVolumeM3 - volumeNeededM3).toFixed(2));
      
      if (volumeNeededM3 > 0) {
        balancePercentage = Number(((actualVolumeM3 / volumeNeededM3) * 100).toFixed(1));
        if (balancePercentage < 92) {
          balanceStatus = 'deficit';
        } else if (balancePercentage > 108) {
          balanceStatus = 'surplus';
        } else {
          balanceStatus = 'optimal';
        }
      } else {
        balanceStatus = actualVolumeM3 > 0 ? 'surplus' : 'optimal';
      }
    }
  }

  // 13. Recommandations et alertes agronomiques
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Alerte sur la durée par rapport au type de sol (fractionnement)
  if (soil.id === 'sablo_limoneux_rmel' && recommendedDurationHours > 2.0) {
    const fractionCount = Math.ceil(recommendedDurationHours / 1.5);
    warnings.push(`Sol très filtrant (« ${soil.localName} ») : Une durée continue de ${recommendedDurationFormatted} risque d'entraîner une perte par percolation en profondeur.`);
    recommendations.push(`Fractionnez l'irrigation en ${fractionCount} apports de ${formatDuration(recommendedDurationHours / fractionCount)} chacun.`);
  }

  if (soil.id === 'argileux_tirs' && recommendedDurationHours > 4.0) {
    warnings.push(`Sol lourd (« ${soil.localName} ») à infiltration lente : Risque d'asphyxie racinaire et de stagnation en surface.`);
    recommendations.push(`Espacez les apports et privilégiez un débit modéré en vérifiant le ressuyage du sol entre deux tours.`);
  }

  // Alerte sur l'efficacité du système
  if (irrigationSystem.id === 'gravitaire_traditionnel') {
    warnings.push(`Le système gravitaire traditionnel engendre ~${100 - efficiency}% de pertes en eau (${volumeLossesM3} m³ perdus pour cette parcelle).`);
    recommendations.push(`Programme PNEI Maroc : Bénéficiez d'une subvention FDA pour convertir cette parcelle au goutte-à-goutte et économiser jusqu'à 40% d'eau.`);
  }

  // Alertes sur le bilan hydrique si calculé
  if (balanceStatus === 'deficit' && balanceM3 !== undefined) {
    warnings.push(`Déficit hydrique de ${Math.abs(balanceM3)} m³ (${balancePercentage}% du besoin couvert). Risque de stress hydrique sur ${crop.name}.`);
    recommendations.push(`Augmentez le temps d'arrosage de ${formatDuration(Math.abs(balanceM3) / (flowRateM3h || 1))} pour couvrir l'intégralité de l'évapotranspiration.`);
  } else if (balanceStatus === 'surplus' && balanceM3 !== undefined) {
    warnings.push(`Surplus d'eau de +${balanceM3} m³ (${balancePercentage}% du besoin). Risque de gaspillage d'eau et de lessivage des fertilisants.`);
    recommendations.push(`Réduisez le temps d'arrosage de ${formatDuration(balanceM3 / (flowRateM3h || 1))} pour préserver la nappe et économiser l'énergie de pompage.`);
  } else if (balanceStatus === 'optimal') {
    recommendations.push(`Apport optimal : Votre durée programmée satisfait 100% des besoins physiologiques de la culture sans gaspillage.`);
  }

  // Condition météo particulière
  if (etc > 6.0) {
    recommendations.push(`Forte demande évaporatoire (ETc = ${etc} mm/j). Veillez à irriguer tôt le matin ou en soirée pour limiter l'évaporation directe.`);
  }

  if (effectiveRainfall > 0) {
    recommendations.push(`La pluie a permis d'économiser ${(effectiveRainfall * surfaceHa * 10).toFixed(1)} m³ d'eau sur votre parcelle.`);
  }

  return {
    id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    input,
    surfaceHa,
    surfaceM2,
    kc,
    et0,
    etc,
    effectiveRainfall,
    netRequirementMm,
    efficiency,
    grossRequirementMm,
    volumeNeededM3,
    volumeNetM3,
    volumeLossesM3,
    flowRateM3h,
    recommendedDurationHours,
    recommendedDurationFormatted,
    actualVolumeM3,
    balanceM3,
    balanceStatus,
    balancePercentage,
    warnings,
    recommendations
  };
}
