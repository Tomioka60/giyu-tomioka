import { Crop, MoroccanRegion, MoroccanSoil, IrrigationSystem } from '../types';

/**
 * Données agronomiques certifiées du Maroc
 * Sources de référence :
 * - INRA Maroc (Institut National de la Recherche Agronomique)
 * - IAV Hassan II (Institut Agronomique et Vétérinaire Hassan II - Rabat)
 * - ENA Meknès (École Nationale d'Agriculture)
 * - FAO Bulletin d'irrigation et de drainage N° 56 (Adaptation Maroc)
 * - PNEI (Programme National d'Économie d'Eau en Irrigation - Ministère de l'Agriculture du Maroc)
 */

export const MOROCCAN_REGIONS: MoroccanRegion[] = [
  {
    id: 'souss_massa',
    name: 'Souss-Massa (Agadir, Taroudant, Chtouka)',
    ormvaOrDpa: 'ORMVA Souss-Massa',
    climateZone: 'Aride à semi-aride côtier / continental',
    typicalRainfallAnnualMm: 220,
    principalCrops: ['Agrumes', 'Maraîchage primeur (Tomate)', 'Arganier', 'Bananes sous serre'],
    // ET0 moyenne journalière par mois (mm/jour)
    monthlyEt0: {
      1: 2.4, 2: 3.1, 3: 4.2, 4: 5.1, 5: 5.9, 6: 6.5,
      7: 6.8, 8: 6.4, 9: 5.2, 10: 4.1, 11: 2.9, 12: 2.2
    }
  },
  {
    id: 'gharb',
    name: 'Gharb (Kénitra, Sidi Slimane, Sidi Kacem)',
    ormvaOrDpa: 'ORMVA Gharb',
    climateZone: 'Subhumide à hiver doux',
    typicalRainfallAnnualMm: 550,
    principalCrops: ['Agrumes', 'Canne à sucre', 'Céréales', 'Avocatier', 'Riz', 'Maraîchage'],
    monthlyEt0: {
      1: 1.8, 2: 2.4, 3: 3.5, 4: 4.6, 5: 5.5, 6: 6.2,
      7: 6.6, 8: 6.3, 9: 5.0, 10: 3.7, 11: 2.3, 12: 1.7
    }
  },
  {
    id: 'haouz',
    name: 'Haouz / Marrakech (Chichaoua, El Kelaâ des Sraghna)',
    ormvaOrDpa: 'ORMVA Haouz',
    climateZone: 'Semi-aride à aride d’intérieur',
    typicalRainfallAnnualMm: 260,
    principalCrops: ['Olivier', 'Agrumes', 'Abricotier', 'Vigne', 'Maraîchage', 'Céréales'],
    monthlyEt0: {
      1: 2.2, 2: 2.9, 3: 4.1, 4: 5.4, 5: 6.5, 6: 7.3,
      7: 7.8, 8: 7.2, 9: 5.7, 10: 4.2, 11: 2.8, 12: 2.0
    }
  },
  {
    id: 'tadla',
    name: 'Tadla (Béni Mellal, Fquih Ben Salah)',
    ormvaOrDpa: 'ORMVA Tadla',
    climateZone: 'Continental semi-aride',
    typicalRainfallAnnualMm: 380,
    principalCrops: ['Olivier', 'Betterave à sucre', 'Agrumes', 'Luzerne', 'Grenadier', 'Céréales'],
    monthlyEt0: {
      1: 1.9, 2: 2.6, 3: 3.8, 4: 5.0, 5: 6.1, 6: 7.0,
      7: 7.5, 8: 7.1, 9: 5.4, 10: 3.9, 11: 2.5, 12: 1.8
    }
  },
  {
    id: 'doukkala',
    name: 'Doukkala (El Jadida, Sidi Bennour)',
    ormvaOrDpa: 'ORMVA Doukkala',
    climateZone: 'Semi-aride maritime tempéré',
    typicalRainfallAnnualMm: 350,
    principalCrops: ['Betterave à sucre', 'Maraîchage (Pomme de terre, Tomate)', 'Maïs', 'Vigne'],
    monthlyEt0: {
      1: 2.0, 2: 2.6, 3: 3.6, 4: 4.7, 5: 5.5, 6: 6.1,
      7: 6.4, 8: 6.2, 9: 5.1, 10: 3.8, 11: 2.6, 12: 1.9
    }
  },
  {
    id: 'saiss',
    name: 'Saïss (Fès, Meknès, El Hajeb)',
    ormvaOrDpa: 'DPA Fès / DPA Meknès',
    climateZone: 'Méditerranéen continental à hiver frais',
    typicalRainfallAnnualMm: 500,
    principalCrops: ['Rosacées fruitières (Pommier, Pêcher)', 'Olivier', 'Oignon', 'Pomme de terre', 'Vigne', 'Céréales'],
    monthlyEt0: {
      1: 1.7, 2: 2.3, 3: 3.4, 4: 4.6, 5: 5.7, 6: 6.6,
      7: 7.2, 8: 6.8, 9: 5.2, 10: 3.7, 11: 2.3, 12: 1.6
    }
  },
  {
    id: 'moulouya',
    name: 'Moulouya / Basse Moulouya (Berkane, Nador, Zaïo)',
    ormvaOrDpa: 'ORMVA Moulouya',
    climateZone: 'Semi-aride méditerranéen',
    typicalRainfallAnnualMm: 340,
    principalCrops: ['Clémentinier de Berkane', 'Oranger', 'Néflier', 'Maraîchage', 'Betterave'],
    monthlyEt0: {
      1: 2.1, 2: 2.7, 3: 3.7, 4: 4.8, 5: 5.7, 6: 6.5,
      7: 7.0, 8: 6.6, 9: 5.3, 10: 3.9, 11: 2.7, 12: 1.9
    }
  },
  {
    id: 'loukkos',
    name: 'Loukkos (Larache, Ksar El Kébir)',
    ormvaOrDpa: 'ORMVA Loukkos',
    climateZone: 'Humide à subhumide côtier',
    typicalRainfallAnnualMm: 680,
    principalCrops: ['Fruits rouges (Fraise, Myrtille, Framboise)', 'Avocatier', 'Canne à sucre', 'Agrumes'],
    monthlyEt0: {
      1: 1.7, 2: 2.2, 3: 3.2, 4: 4.3, 5: 5.2, 6: 5.9,
      7: 6.3, 8: 6.0, 9: 4.8, 10: 3.5, 11: 2.2, 12: 1.6
    }
  },
  {
    id: 'draa_tafilalet',
    name: 'Drâa-Tafilalet / Ouarzazate (Errachidia, Tinghir, Zagora)',
    ormvaOrDpa: 'ORMVA Ouarzazate / ORMVA Tafilalet',
    climateZone: 'Hyper-aride saharien et pré-saharien',
    typicalRainfallAnnualMm: 130,
    principalCrops: ['Palmier Dattier (Majhoul, Boufeggous)', 'Pommier (Midelt)', 'Luzerne oasis', 'Henné'],
    monthlyEt0: {
      1: 2.5, 2: 3.4, 3: 4.8, 4: 6.3, 5: 7.4, 6: 8.4,
      7: 8.9, 8: 8.2, 9: 6.6, 10: 4.8, 11: 3.2, 12: 2.3
    }
  },
  {
    id: 'chaouia_abda',
    name: 'Chaouia - Abda (Settat, Berrechid, Safi)',
    ormvaOrDpa: 'DPA Settat / DPA Safi',
    climateZone: 'Semi-aride atlantique',
    typicalRainfallAnnualMm: 320,
    principalCrops: ['Céréales (Blé, Orge)', 'Légumineuses (Fève, Petit pois)', 'Maraîchage', 'Olivier'],
    monthlyEt0: {
      1: 1.9, 2: 2.5, 3: 3.6, 4: 4.8, 5: 5.7, 6: 6.4,
      7: 6.8, 8: 6.5, 9: 5.2, 10: 3.9, 11: 2.6, 12: 1.8
    }
  }
];

export const MOROCCAN_CROPS: Crop[] = [
  {
    id: 'olivier',
    name: 'Olivier (Zitoun)',
    category: 'arboriculture',
    rootDepthMeters: 1.2,
    depletionFractionP: 0.65,
    notesAgro: 'Arbre résistant au stress, mais l\'irrigation aux stades floraison/nouaison et grossissement est cruciale pour le rendement en huile.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Débourrement / Reprise végétative (Fév - Mars)',
        kc: 0.65,
        durationDaysApprox: 45,
        description: 'Reprise d\'activité cambiale et développement des bourgeons.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Floraison & Nouaison (Avril - Mai)',
        kc: 0.70,
        durationDaysApprox: 50,
        description: 'Période très sensible au déficit hydrique qui conditionne le nombre d\'olives.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Grossissement des fruits & Durcissement noyau (Juin - Août)',
        kc: 0.65,
        durationDaysApprox: 90,
        description: 'Accumulation d\'huile et croissance de la pulpe.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Maturation / Véraison (Sept - Nov)',
        kc: 0.60,
        durationDaysApprox: 60,
        description: 'Changement de couleur et préparation à la récolte.'
      }
    }
  },
  {
    id: 'agrumes',
    name: 'Agrumes (Oranger, Clémentinier)',
    category: 'arboriculture',
    rootDepthMeters: 1.0,
    depletionFractionP: 0.50,
    notesAgro: 'Sensibilité élevée au stress hydrique, particulièrement entre la floraison et la chute physiologique de juin.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Débourrement & Boutons floraux (Fév - Mars)',
        kc: 0.70,
        durationDaysApprox: 40,
        description: 'Apparition des jeunes pousses et boutons floraux.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Pleine floraison & Nouaison (Avril - Mai)',
        kc: 0.70,
        durationDaysApprox: 50,
        description: 'Phase critique : éviter tout stress hydrique provoquant la chute des nouures.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Grossissement rapide des fruits (Juin - Sept)',
        kc: 0.65,
        durationDaysApprox: 110,
        description: 'Développement volumique du fruit et accumulation de jus.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Véraison & Maturation (Oct - Déc)',
        kc: 0.70,
        durationDaysApprox: 60,
        description: 'Coloration de l\'écorce et équilibre sucre/acidité.'
      }
    }
  },
  {
    id: 'tomate',
    name: 'Tomate (Maraîchage sous serre / plein champ)',
    category: 'maraichage',
    rootDepthMeters: 0.7,
    depletionFractionP: 0.40,
    notesAgro: 'Culture exigeante à enracinement moyen. Nécessite une irrigation régulière en goutte-à-goutte pour éviter le cul noir (nécrose apicale).',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Reprise / Plantation (1-25 jours)',
        kc: 0.60,
        durationDaysApprox: 25,
        description: 'Enracinement après repiquage.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Croissance végétative & 1ers bouquets (25-55 j)',
        kc: 0.85,
        durationDaysApprox: 30,
        description: 'Croissance rapide des tiges et premières fleurs.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Plein grossissement & Récoltes continues',
        kc: 1.15,
        durationDaysApprox: 50,
        description: 'Pic de consommation en eau évapotranspiratoire.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Dernières cueillettes / Fin de cycle',
        kc: 0.80,
        durationDaysApprox: 30,
        description: 'Ralentissement de la production.'
      }
    }
  },
  {
    id: 'pomme_de_terre',
    name: 'Pomme de terre (Batata)',
    category: 'maraichage',
    rootDepthMeters: 0.6,
    depletionFractionP: 0.35,
    notesAgro: 'Très sensible au stress hydrique lors de la tubérisation. Un manque d\'eau provoque des déformations ou crevasses.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Levée & Émergence (1-20 jours)',
        kc: 0.50,
        durationDaysApprox: 20,
        description: 'Sortie des tiges et enracinement superficiel.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Croissance foliaire & Initiation des tubercules',
        kc: 0.80,
        durationDaysApprox: 30,
        description: 'Stolonisation et initiation des tubercules.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Grossissement des tubercules',
        kc: 1.15,
        durationDaysApprox: 45,
        description: 'Période de besoin maximal en eau.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Sénescence des fanes & Maturation',
        kc: 0.75,
        durationDaysApprox: 25,
        description: 'Durcissement de la peau et arrêt des apports avant arrachage.'
      }
    }
  },
  {
    id: 'fruits_rouges',
    name: 'Fruits rouges (Fraise / Myrtille / Framboise)',
    category: 'fruits_rouges',
    rootDepthMeters: 0.4,
    depletionFractionP: 0.30,
    notesAgro: 'Enracinement superficiel (< 40 cm). Irrigation très fréquente par petits volumes pour maintenir une humidité constante sans engorgement.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Installation des plants & Reprise (Automne)',
        kc: 0.45,
        durationDaysApprox: 30,
        description: 'Enracinement des mottes sur billons paillés.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Émission foliaire & Premières hampes',
        kc: 0.75,
        durationDaysApprox: 40,
        description: 'Développement de la masse végétative.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Pleine floraison & Cueillettes intensives',
        kc: 0.95,
        durationDaysApprox: 70,
        description: 'Besoin hydrique élevé, éviter tout assèchement superficiel.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Fin de cueillette / Régénération',
        kc: 0.70,
        durationDaysApprox: 30,
        description: 'Baisse graduelle des besoins.'
      }
    }
  },
  {
    id: 'avocatier',
    name: 'Avocatier (Hass / Fuerte)',
    category: 'arboriculture',
    rootDepthMeters: 0.8,
    depletionFractionP: 0.45,
    notesAgro: 'Système racinaire superficiel très sensible à l\'asphyxie racinaire (Phytophthora) et au stress hydrique lors de la nouaison.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Débourrement & Pousse printanière',
        kc: 0.60,
        durationDaysApprox: 45,
        description: 'Apparition des nouvelles feuilles et panicules.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Floraison & Nouaison critique',
        kc: 0.75,
        durationDaysApprox: 45,
        description: 'Stress hydrique strictement interdit pour éviter l\'avortement.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Grossissement des fruits & Pousse estivale',
        kc: 0.85,
        durationDaysApprox: 100,
        description: 'Fort besoin en eau régulier.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Maturation & Récolte hivernale',
        kc: 0.75,
        durationDaysApprox: 60,
        description: 'Accumulation de matière sèche et huile.'
      }
    }
  },
  {
    id: 'palmier_dattier',
    name: 'Palmier Dattier (Majhoul, Boufeggous)',
    category: 'arboriculture',
    rootDepthMeters: 2.0,
    depletionFractionP: 0.55,
    notesAgro: 'Grand consommateur d\'eau dans les zones oasiennes à forte ET0 (6 à 9 mm/j en été). L\'irrigation localisée modernisée permet d\'économiser jusqu\'à 40% d\'eau par rapport au tour d\'eau traditionnel.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Pollinisation & Nouaison (Mars - Avril)',
        kc: 0.80,
        durationDaysApprox: 45,
        description: 'Phase cruciale de fécondation et fixation des régimes.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Stade Kimri / Croissance verte (Mai - Juin)',
        kc: 0.90,
        durationDaysApprox: 60,
        description: 'Augmentation de la taille et poids des dattes vertes.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Stade Khalal & Rutab / Pic estival (Juil - Août)',
        kc: 0.95,
        durationDaysApprox: 60,
        description: 'Demande évapotranspiratoire maximale avec chaleur extrême.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Stade Tamar / Maturation & Récolte (Sept - Nov)',
        kc: 0.80,
        durationDaysApprox: 60,
        description: 'Diminution modérée pour préserver la qualité des dattes.'
      }
    }
  },
  {
    id: 'betterave_a_sucre',
    name: 'Betterave à Sucre',
    category: 'grandes_cultures',
    rootDepthMeters: 1.1,
    depletionFractionP: 0.55,
    notesAgro: 'Culture clé des périmètres irrigués (Doukkala, Tadla, Gharb, Moulouya). Sensible au stress au stade couverture complète du sol.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Semis & Levée (1-30 jours)',
        kc: 0.35,
        durationDaysApprox: 30,
        description: 'Implantation et émergence des premières paires de feuilles.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Couverture du sol (30-70 jours)',
        kc: 0.80,
        durationDaysApprox: 40,
        description: 'Fermeture de l\'interligne.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Grossissement de la racine & Richesse sucrière',
        kc: 1.20,
        durationDaysApprox: 60,
        description: 'Période de consommation maximale.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Maturation finale avant arrachage',
        kc: 0.70,
        durationDaysApprox: 40,
        description: 'Arrêt de l\'irrigation 15 à 20 jours avant la récolte.'
      }
    }
  },
  {
    id: 'pommier',
    name: 'Pommier (Midelt, Meknès, Haouz)',
    category: 'arboriculture',
    rootDepthMeters: 1.0,
    depletionFractionP: 0.50,
    notesAgro: 'Sensible au stress hydrique estival qui réduit le calibre des fruits et induit l\'alternance de production.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Débourrement & Floraison (Mars - Avril)',
        kc: 0.45,
        durationDaysApprox: 35,
        description: 'Ouverture des boutons et floraison.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Nouaison & Chute physiologique (Mai)',
        kc: 0.75,
        durationDaysApprox: 35,
        description: 'Fixation du nombre de pommes par arbre.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Grossissement des pommes (Juin - Août)',
        kc: 0.95,
        durationDaysApprox: 85,
        description: 'Prise de calibre et fermeté du fruit.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Maturation & Récolte (Sept - Oct)',
        kc: 0.70,
        durationDaysApprox: 40,
        description: 'Coloration et accumulation de sucres.'
      }
    }
  },
  {
    id: 'ble_tendre',
    name: 'Blé tendre / Céréales d\'hiver',
    category: 'grandes_cultures',
    rootDepthMeters: 0.9,
    depletionFractionP: 0.55,
    notesAgro: 'Irrigation d\'appoint (irrigation de complément) essentielle en cas d\'arrêt précoce des pluies printanières au Maroc.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Levée & Tallage (Automne/Hiver)',
        kc: 0.35,
        durationDaysApprox: 45,
        description: 'Implantation du chevelu racinaire et talles.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Montaison (Février - Mars)',
        kc: 0.80,
        durationDaysApprox: 35,
        description: 'Élongation des tiges et initiation de l\'épi.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Épiaison, Floraison & Remplissage du grain',
        kc: 1.15,
        durationDaysApprox: 40,
        description: 'Stade très vulnérable à l\'échaudage et au déficit hydrique.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Maturation & Dessiccation du grain',
        kc: 0.25,
        durationDaysApprox: 30,
        description: 'Arrêt de l\'alimentation hydrique.'
      }
    }
  },
  {
    id: 'luzerne',
    name: 'Luzerne pérenne (Fourrage)',
    category: 'fourrages',
    rootDepthMeters: 1.5,
    depletionFractionP: 0.55,
    notesAgro: 'Culture fourragère à fortes coupes successives (6 à 8 coupes/an au Tadla et Souss). Exige des apports d\'eau constants.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Repousse post-fauche (0-7 jours)',
        kc: 0.40,
        durationDaysApprox: 8,
        description: 'Faible feuillage juste après la coupe.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Élongation rapide des tiges (8-20 jours)',
        kc: 0.85,
        durationDaysApprox: 14,
        description: 'Croissance de la biomasse aérienne.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Pleine végétation avant floraison (21-35 j)',
        kc: 1.15,
        durationDaysApprox: 15,
        description: 'Couverture complète, besoin hydrique maximal.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Début floraison (Fauche imminente)',
        kc: 1.05,
        durationDaysApprox: 8,
        description: 'Arrêt de l\'arrosage 2 à 3 jours avant fauche.'
      }
    }
  },
  {
    id: 'vigne',
    name: 'Vigne (Raisin de table & cuve)',
    category: 'arboriculture',
    rootDepthMeters: 1.2,
    depletionFractionP: 0.50,
    notesAgro: 'Irrigation maîtrisée (RDI / Déficit hydrique contrôlé) pour optimiser le calibre, le croquant et le taux de sucre.',
    stages: {
      initial: {
        stage: 'initial',
        label: 'Débourrement & Premières feuilles',
        kc: 0.30,
        durationDaysApprox: 35,
        description: 'Reprise printanière.'
      },
      developpement: {
        stage: 'developpement',
        label: 'Floraison & Nouaison des grappes',
        kc: 0.65,
        durationDaysApprox: 40,
        description: 'Formation des baies.'
      },
      mi_saison: {
        stage: 'mi_saison',
        label: 'Grossissement des baies & Véraison',
        kc: 0.85,
        durationDaysApprox: 55,
        description: 'Besoins soutenus sans excès foliaire.'
      },
      fin_saison: {
        stage: 'fin_saison',
        label: 'Maturation & Post-récolte',
        kc: 0.45,
        durationDaysApprox: 45,
        description: 'Aoûtement des sarments.'
      }
    }
  }
];

export const MOROCCAN_SOILS: MoroccanSoil[] = [
  {
    id: 'argileux_tirs',
    name: 'Argileux lourd (« Tirs »)',
    localName: 'Tirs (Terre noire argileuse)',
    availableWaterCapacityMmPerM: 180, // 180 mm/m de RU
    infiltrationRateMmPerHour: 6, // infiltration lente
    advice: 'Grande réserve en eau mais infiltration lente. Risque de ruissellement et d\'asphyxie racinaire. Fractionner les arrosages ou adopter des débits de goutteurs faibles (ex: 1.6 à 2 L/h).'
  },
  {
    id: 'limoneux_hamri',
    name: 'Limono-argileux (« Hamri »)',
    localName: 'Hamri (Terre rouge fertile équilibrée)',
    availableWaterCapacityMmPerM: 150,
    infiltrationRateMmPerHour: 15, // infiltration modérée
    advice: 'Sol d\'excellente fertilité agricole très répandu (Saïss, Tadla, Haouz). Bonne rétention en eau et vitesse d\'infiltration équilibrée.'
  },
  {
    id: 'sablo_limoneux_rmel',
    name: 'Sablo-limoneux (« Rmel »)',
    localName: 'Rmel (Sols sableux légers / côtiers)',
    availableWaterCapacityMmPerM: 90,
    infiltrationRateMmPerHour: 30, // infiltration très rapide
    advice: 'Percolation rapide et faible réserve utile en eau. Impératif de fractionner l\'irrigation en cycles courts et fréquents pour éviter les pertes d\'eau et d\'engrais en profondeur.'
  },
  {
    id: 'caillouteux_alluvionnaire',
    name: 'Caillouteux / Alluvionnaire (« Biar / Hrach »)',
    localName: 'Hrach / Sols alluvionnaires de piémont',
    availableWaterCapacityMmPerM: 110,
    infiltrationRateMmPerHour: 22,
    advice: 'Sol drainant contenant des éléments grossiers. Réserve en eau réduite proportionnellement au taux de cailloux.'
  }
];

export const IRRIGATION_SYSTEMS: IrrigationSystem[] = [
  {
    id: 'goutte_a_goutte',
    name: 'Goutte-à-goutte (Micro-irrigation / Localisée)',
    defaultEfficiency: 90,
    minEfficiency: 80,
    maxEfficiency: 95,
    flowUnitAdvised: 'm3_h',
    description: 'Système haute précision apportant l\'eau directement au bulbe racinaire. Réduit considérablement l\'évaporation superficielle.',
    pneiStatus: 'Subventionné jusqu\'à 100% par le FDA (Fonds de Développement Agricole / PNEI) selon la taille de l\'exploitation.'
  },
  {
    id: 'aspersion',
    name: 'Aspersion (Couverture intégrale / Pivot / Rampe)',
    defaultEfficiency: 75,
    minEfficiency: 65,
    maxEfficiency: 85,
    flowUnitAdvised: 'm3_h',
    description: 'Imite la pluie naturelle. Sensible au vent fort (Chergui) qui dégrade l\'uniformité et augmente l\'évaporation directe.',
    pneiStatus: 'Subventions FDA ciblées sur les grandes cultures céréalières et betteravières.'
  },
  {
    id: 'gravitaire_ameliore',
    name: 'Gravitaire amélioré (Tuyaux californiens / Siphons / Raies courtes)',
    defaultEfficiency: 65,
    minEfficiency: 55,
    maxEfficiency: 75,
    flowUnitAdvised: 'l_s',
    description: 'Amélioration du réseau de surface réduisant les pertes en tête de parcelle par rapport au gravitaire traditionnel.',
    pneiStatus: 'Éligible aux programmes de modernisation des réseaux collectifs ORMVA.'
  },
  {
    id: 'gravitaire_traditionnel',
    name: 'Gravitaire traditionnel (Seguia / Submersion / À la raie rustique)',
    defaultEfficiency: 50,
    minEfficiency: 40,
    maxEfficiency: 60,
    flowUnitAdvised: 'l_s',
    description: 'Fortes pertes par infiltration dans les rigoles en terre et percolation profonde en tête de parcelle.',
    pneiStatus: 'Non encouragé : Programme PNEI visant la reconversion vers le goutte-à-goutte.'
  }
];

/**
 * Préréglages rapides typiques du Maroc pour faciliter la saisie aux agriculteurs
 */
export const MOROCCAN_PRESETS = [
  {
    label: 'Agrumes Souss-Massa (Goutte-à-goutte)',
    regionId: 'souss_massa',
    cropId: 'agrumes',
    growthStage: 'mi_saison' as const,
    month: 7, // Juillet
    soilId: 'sablo_limoneux_rmel' as const,
    irrigationSystemId: 'goutte_a_goutte' as const,
    surfaceValue: 5,
    surfaceUnit: 'ha' as const,
    flowRate: 35,
    flowUnit: 'm3_h' as const,
    rainfall: 0,
    parcelName: 'Verger Clémentiniers Souss'
  },
  {
    label: 'Olivier Haouz Marrakech (Goutte-à-goutte)',
    regionId: 'haouz',
    cropId: 'olivier',
    growthStage: 'mi_saison' as const,
    month: 6, // Juin
    soilId: 'limoneux_hamri' as const,
    irrigationSystemId: 'goutte_a_goutte' as const,
    surfaceValue: 10,
    surfaceUnit: 'ha' as const,
    flowRate: 45,
    flowUnit: 'm3_h' as const,
    rainfall: 0,
    parcelName: 'Oliveraie El Kelaâ Haouz'
  },
  {
    label: 'Tomate primeur Chtouka (Serre GàG)',
    regionId: 'souss_massa',
    cropId: 'tomate',
    growthStage: 'mi_saison' as const,
    month: 4, // Avril
    soilId: 'sablo_limoneux_rmel' as const,
    irrigationSystemId: 'goutte_a_goutte' as const,
    surfaceValue: 2,
    surfaceUnit: 'ha' as const,
    flowRate: 20,
    flowUnit: 'm3_h' as const,
    rainfall: 0,
    parcelName: 'Serres Tomates Chtouka'
  },
  {
    label: 'Fruits rouges Loukkos (Goutte-à-goutte)',
    regionId: 'loukkos',
    cropId: 'fruits_rouges',
    growthStage: 'mi_saison' as const,
    month: 5, // Mai
    soilId: 'sablo_limoneux_rmel' as const,
    irrigationSystemId: 'goutte_a_goutte' as const,
    surfaceValue: 3,
    surfaceUnit: 'ha' as const,
    flowRate: 25,
    flowUnit: 'm3_h' as const,
    rainfall: 0,
    parcelName: 'Fraiseraie Larache'
  },
  {
    label: 'Palmier Dattier Majhoul Tafilalet',
    regionId: 'draa_tafilalet',
    cropId: 'palmier_dattier',
    growthStage: 'mi_saison' as const,
    month: 7, // Juillet
    soilId: 'caillouteux_alluvionnaire' as const,
    irrigationSystemId: 'goutte_a_goutte' as const,
    surfaceValue: 4,
    surfaceUnit: 'ha' as const,
    flowRate: 30,
    flowUnit: 'm3_h' as const,
    rainfall: 0,
    parcelName: 'Palmeraie Majhoul Errachidia'
  }
];

export const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
