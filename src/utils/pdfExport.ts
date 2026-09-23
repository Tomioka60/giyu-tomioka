import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CalculationResult } from '../types';
import { 
  MOROCCAN_REGIONS, 
  MOROCCAN_CROPS, 
  MOROCCAN_SOILS, 
  IRRIGATION_SYSTEMS, 
  MONTH_NAMES 
} from '../data/moroccoData';

/**
 * Générateur de rapport PDF professionnel pour AgriIrrig
 * Format A4 portrait, mise en page vectorielle
 */
export async function exportCalculationToPdf(
  result: CalculationResult,
  chartsElementId?: string
): Promise<void> {

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm

  // Labels de référence
  const crop = MOROCCAN_CROPS.find(c => c.id === result.input.cropId);
  const region = MOROCCAN_REGIONS.find(r => r.id === result.input.regionId);
  const soil = MOROCCAN_SOILS.find(s => s.id === result.input.soilId);
  const system = IRRIGATION_SYSTEMS.find(sys => sys.id === result.input.irrigationSystemId);
  
  const stageLabels: Record<string, string> = {
    initial: 'Stade Initial (Reprise / Levée)',
    developpement: 'Stade Développement Végétatif',
    mi_saison: 'Mi-Saison (Floraison / Grossissement)',
    fin_saison: 'Fin de Saison (Maturation / Récolte)',
  };
  const stageLabel = stageLabels[result.input.growthStage] || result.input.growthStage;
  const monthLabel = MONTH_NAMES[result.input.month - 1] || `Mois ${result.input.month}`;

  let y = margin;

  // 1. EN-TÊTE SUPÉRIEUR (Vert Émeraude Foncé)
  doc.setFillColor(15, 60, 40); // #0f3c28
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  // Titre & Sous-titre
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AGRI-IRRIG', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 242, 210);
  doc.text("Bulletin Technique de Prescription & Bilan d'Irrigation de Précision", margin + 6, y + 14);
  doc.setFontSize(7.5);
  doc.text("Calcul des volumes d'arrosage et des temps d'ouverture des vannes", margin + 6, y + 19);

  // Badge Date & Réf à droite
  const dateFormatted = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Date : ${dateFormatted}`, pageWidth - margin - 6, y + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 235, 215);
  doc.text(`Réf : ${result.id.slice(0, 16).toUpperCase()}`, pageWidth - margin - 6, y + 14, { align: 'right' });
  doc.text(`Mois : ${monthLabel}`, pageWidth - margin - 6, y + 19, { align: 'right' });

  y += 28;

  // 2. ENCADRÉ PRINCIPAL : PRESCRIPTION CLÉ (DURÉE & VOLUME)
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD');

  // Bloc gauche: Durée recommandée
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text("DURÉE D'ARROSAGE RECOMMANDÉE :", margin + 6, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text(result.recommendedDurationFormatted, margin + 6, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  doc.text(`(Au débit de ${result.flowRateM3h} m³/h soit ${(result.flowRateM3h / 3.6).toFixed(1)} L/s)`, margin + 6, y + 22);

  // Bloc milieu: Volume brut à pomper
  const col2X = margin + 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text('VOLUME BRUT NÉCESSAIRE :', col2X, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(29, 78, 216); // blue-700
  doc.text(`${result.volumeNeededM3.toLocaleString('fr-FR')} m³`, col2X, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  doc.text(`Dose : ${(result.volumeNeededM3 / result.surfaceHa).toFixed(1)} m³/ha (${result.grossRequirementMm} mm)`, col2X, y + 22);

  // Bloc droite: Bilan diagnostique
  const col3X = margin + 130;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);
  doc.text('DIAGNOSTIC APPORT :', col3X, y + 8);

  if (result.actualVolumeM3 !== undefined && result.balanceStatus) {
    const isDeficit = result.balanceStatus === 'deficit';
    const isSurplus = result.balanceStatus === 'surplus';
    const statusText = isDeficit ? 'DÉFICIT HYDRIQUE' : isSurplus ? 'SURPLUS (Gaspillage)' : 'OPTIMAL';
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (isDeficit) doc.setTextColor(185, 28, 28);
    else if (isSurplus) doc.setTextColor(29, 78, 216);
    else doc.setTextColor(4, 120, 87);

    doc.text(statusText, col3X, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`Apport réel : ${result.actualVolumeM3} m³ (${result.balancePercentage}%)`, col3X, y + 20);
    doc.text(`Écart : ${result.balanceM3 && result.balanceM3 > 0 ? '+' : ''}${result.balanceM3} m³`, col3X, y + 23.5);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Durée programmée', col3X, y + 15);
    doc.text('non spécifiée', col3X, y + 19);
  }

  y += 30;

  // 3. TABLEAU DES CARACTÉRISTIQUES DE LA PARCELLE & FACTEURS AGRONOMIQUES
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('1. Identification de la Parcelle & Paramètres du Terroir', margin + 4, y + 6);

  // Ligne de séparation fine
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 4, y + 8, margin + contentWidth - 4, y + 8);

  const leftColX = margin + 4;
  const rightColX = margin + 96;
  let rowY = y + 14;
  const rowSpacing = 6;

  doc.setFontSize(8);

  // Ligne 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Nom de la parcelle :', leftColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(result.input.parcelName || 'Non nommée', leftColX + 38, rowY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Région / ORMVA :', rightColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(region ? `${region.name}` : result.input.regionId, rightColX + 34, rowY);

  // Ligne 2
  rowY += rowSpacing;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Culture :', leftColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(crop ? crop.name : result.input.cropId, leftColX + 38, rowY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Superficie :', rightColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.surfaceHa.toFixed(2)} ha (${result.surfaceM2.toLocaleString('fr-FR')} m²)`, rightColX + 34, rowY);

  // Ligne 3
  rowY += rowSpacing;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Stade végétatif :', leftColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(stageLabel, leftColX + 38, rowY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Type de sol :', rightColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(soil ? `${soil.name} (${soil.localName})` : result.input.soilId, rightColX + 34, rowY);

  // Ligne 4
  rowY += rowSpacing;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Système d\'irrigation :', leftColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(system ? `${system.name} (Ea = ${result.efficiency}%)` : `${result.efficiency}%`, leftColX + 38, rowY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Débit disponible :', rightColX, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.flowRateM3h} m³/h (${(result.flowRateM3h / 3.6).toFixed(1)} L/s)`, rightColX + 34, rowY);

  y += 46;

  // 4. TABLEAU DES CALCULS SCIENTIFIQUES (MÉTHODE FAO-56 / INRA MAROC)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Décomposition des Calculs Hydro-Climatiques', margin + 4, y + 6);

  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 4, y + 8, margin + contentWidth - 4, y + 8);

  // Entête du tableau à 4 colonnes
  const colW1 = 58;
  const colW2 = 32;
  const colW3 = 42;
  const colW4 = 50;

  let tableY = y + 13;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin + 4, tableY - 4, contentWidth - 8, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PARAMÈTRE HYDRO-CLIMATIQUE', margin + 6, tableY);
  doc.text('VALEUR UNITAIRE', margin + 6 + colW1, tableY);
  doc.text('FORMULE / RÉFÉRENCE', margin + 6 + colW1 + colW2, tableY);
  doc.text('IMPACT SUR LA PARCELLE', margin + 6 + colW1 + colW2 + colW3, tableY);

  const tableRows = [
    {
      param: 'Évapotranspiration Référence (ET0)',
      val: `${result.et0} mm/jour`,
      ref: 'Données climatiques régionales',
      impact: `Demande évaporative (${monthLabel})`
    },
    {
      param: 'Coefficient cultural (Kc)',
      val: `${result.kc.toFixed(2)}`,
      ref: `${crop?.name || 'Culture'} - ${result.input.growthStage}`,
      impact: 'Sensibilité phénologique au stress'
    },
    {
      param: 'Évapotranspiration Culture (ETc)',
      val: `${result.etc} mm/jour`,
      ref: 'ETc = ET0 × Kc',
      impact: 'Besoins en eau bruts de la plante'
    },
    {
      param: 'Précipitation & Pluie efficace (Peff)',
      val: `${result.effectiveRainfall} mm/jour`,
      ref: 'Calcul des pluies utiles',
      impact: result.effectiveRainfall > 0 
        ? `Économie : ${(result.effectiveRainfall * result.surfaceHa * 10).toFixed(0)} m³ sur la parcelle` 
        : 'Aucun apport pluvial comptabilisé'
    },
    {
      param: 'Besoin Net d\'irrigation (Bn)',
      val: `${result.netRequirementMm} mm/jour`,
      ref: 'Bn = max(0, ETc - Peff)',
      impact: `Volume net : ${result.volumeNetM3.toLocaleString('fr-FR')} m³ utile racines`
    },
    {
      param: 'Besoin Brut d\'irrigation (Bb)',
      val: `${result.grossRequirementMm} mm/jour`,
      ref: 'Bb = Bn / (Ea / 100)',
      impact: `Volume à apporter : ${result.volumeNeededM3.toLocaleString('fr-FR')} m³ (Ea = ${result.efficiency}%)`
    }
  ];

  tableRows.forEach((row) => {
    tableY += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(row.param, margin + 6, tableY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(4, 120, 87);
    doc.setFont('helvetica', 'bold');
    doc.text(row.val, margin + 6 + colW1, tableY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(row.ref, margin + 6 + colW1 + colW2, tableY);

    doc.setTextColor(51, 65, 85);
    doc.text(row.impact, margin + 6 + colW1 + colW2 + colW3, tableY);
  });

  y += 58;

  // 5. BILAN VOLUMIQUE & PROJECTION
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Bilan d\'Application Réseau & Projection de Consommation', margin + 4, y + 6);

  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 4, y + 8, margin + contentWidth - 4, y + 8);

  const volCol1 = margin + 6;
  const volCol2 = margin + 66;
  const volCol3 = margin + 126;

  // Boîte 1: Eau utile
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(volCol1, y + 11, 54, 19, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70);
  doc.text('EAU UTILE RACINES (Net)', volCol1 + 4, y + 16);
  doc.setFontSize(12);
  doc.text(`${result.volumeNetM3.toLocaleString('fr-FR')} m³`, volCol1 + 4, y + 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105);
  doc.text(`${((result.volumeNetM3 / result.volumeNeededM3) * 100).toFixed(0)}% du volume pompé`, volCol1 + 4, y + 27.5);

  // Boîte 2: Pertes réseau
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(volCol2, y + 11, 54, 19, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text('PERTES D\'EFFICIENCE RÉSEAU', volCol2 + 4, y + 16);
  doc.setFontSize(12);
  doc.text(`+${result.volumeLossesM3.toLocaleString('fr-FR')} m³`, volCol2 + 4, y + 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);
  doc.text(`${((result.volumeLossesM3 / result.volumeNeededM3) * 100).toFixed(0)}% (drainage, évap, fuites)`, volCol2 + 4, y + 27.5);

  // Boîte 3: Projection 7 jours
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(volCol3, y + 11, 50, 19, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 64, 175);
  doc.text('PROJECTION CUMULÉE 7 JOURS', volCol3 + 4, y + 16);
  doc.setFontSize(12);
  doc.text(`${(result.volumeNeededM3 * 7).toLocaleString('fr-FR')} m³`, volCol3 + 4, y + 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(37, 99, 235);
  doc.text(`Soit ${(result.recommendedDurationHours * 7).toFixed(1)} heures de pompage`, volCol3 + 4, y + 27.5);

  y += 38;

  // 6. DIAGNOSTIC TECHNIQUE & CONSEILS INRA / PNEI
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Diagnostic Agronomique & Conseils d\'Exploitation', margin + 4, y + 6);

  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 4, y + 8, margin + contentWidth - 4, y + 8);

  let recY = y + 13;

  // Warnings si existants
  if (result.warnings.length > 0) {
    result.warnings.slice(0, 2).forEach((warn) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(185, 28, 28); // rouge avertissement
      doc.text('⚠️ ALERTE :', margin + 6, recY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(127, 29, 29);
      const splitWarn = doc.splitTextToSize(warn, contentWidth - 32);
      doc.text(splitWarn, margin + 24, recY);
      recY += (splitWarn.length * 4) + 2;
    });
  }

  // Recommandations
  const recsToPrint = result.recommendations.slice(0, 3);
  recsToPrint.forEach((rec, idx) => {
    if (recY < y + 48) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(4, 120, 87);
      doc.text(`✓ Conseil ${idx + 1} :`, margin + 6, recY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const splitRec = doc.splitTextToSize(rec, contentWidth - 32);
      doc.text(splitRec, margin + 24, recY);
      recY += (splitRec.length * 4) + 2;
    }
  });

  y += 58;

  // 7. PIED DE PAGE TECHNIQUE & VISA D'EXPLOITATION
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `AgriIrrig • Bulletin technique de pilotage d'irrigation et de gestion des vannes d'arrosage.`,
    margin,
    pageHeight - 14
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(
    `Document d'exploitation parcellaire • Page 1/1`,
    margin,
    pageHeight - 10
  );

  // Cadre de visa exploitant / responsable d'arrosage
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - margin - 55, pageHeight - 22, 55, 14, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(23, 63, 53); // #173F35
  doc.text(`Visa Responsable Exploitation :`, pageWidth - margin - 52, pageHeight - 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date & Signature :`, pageWidth - margin - 52, pageHeight - 11);

  // Capture optionnelle des graphiques si un ID est passé
  if (chartsElementId) {
    try {
      const chartsEl = document.getElementById(chartsElementId);
      if (chartsEl) {
        const canvas = await html2canvas(chartsEl, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
        });
        const imgData = canvas.toDataURL('image/png');
        
        // Ajouter une seconde page pour les graphiques haute résolution
        doc.addPage('a4', 'portrait');

        // Header page 2
        doc.setFillColor(15, 60, 40);
        doc.roundedRect(margin, margin, contentWidth, 16, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('AGRI-IRRIG — Graphiques & Visualisations de la Parcelle', margin + 6, margin + 7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(190, 242, 210);
        doc.text(`Parcelle : ${result.input.parcelName} • Date : ${dateFormatted}`, margin + 6, margin + 12);

        // Intégration de l'image des graphiques
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', margin, margin + 22, imgWidth, Math.min(imgHeight, 230));

        // Footer page 2
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Annexe Graphique • AgriIrrig • Page 2/2`,
          margin,
          pageHeight - 10
        );
      }
    } catch (err) {
      console.warn('Erreur capture graphiques pour le PDF:', err);
    }
  }

  // Nom de fichier propre et explicite
  const sanitizedParcelName = (result.input.parcelName || 'parcelle')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 25);
  const fileName = `Bulletin_Irrigation_${sanitizedParcelName}_${new Date().toISOString().slice(0, 10)}.pdf`;

  // Téléchargement du fichier
  doc.save(fileName);
}
