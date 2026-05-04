import { Injectable } from '@nestjs/common';

/**
 * Section 10B — Cadre Juridique Foncier par Pays (Phase 1)
 * Matrice de validation documentaire conforme aux lois 2023-2025.
 */

export type DocumentStatus = 'ACCEPTED' | 'CONDITIONAL' | 'REFUSED';

export interface LegalDocument {
  code: string;
  label: string;
  authority: string;
  legalBasis: string;
  status: DocumentStatus;
  note?: string;
}

@Injectable()
export class LegalFrameworkService {
  /** Section 10B.1 — Bénin (Réforme Post-2023 + Modification 2024) */
  private readonly beninDocs: LegalDocument[] = [
    {
      code: 'TF',
      label: 'Titre Foncier (TF)',
      authority: 'ANDF / BCDF',
      legalBasis: 'Loi 2013-01 mod. 2024',
      status: 'ACCEPTED',
      note: 'Prioritaire — preuve absolue',
    },
    {
      code: 'ADC',
      label: 'Attestation de Détention Coutumière',
      authority: 'Mairie',
      legalBasis: 'CFD 2013 art.',
      status: 'ACCEPTED',
      note: 'Avec levé topographique obligatoire',
    },
    {
      code: 'AR',
      label: 'Attestation de Recasement',
      authority: 'Mairie',
      legalBasis: 'CFD 2013',
      status: 'ACCEPTED',
      note: 'Zones loties uniquement',
    },
    {
      code: 'CONV_NOTARIE',
      label: 'Convention de vente notariée seule',
      authority: 'Notaire',
      legalBasis: 'Réforme 15/08/2023',
      status: 'REFUSED',
      note: 'INSUFFISANTE depuis 15/08/2023',
    },
    {
      code: 'CONV_MAIRE',
      label: 'Convention de vente affirmée par le maire',
      authority: 'Mairie',
      legalBasis: 'Réforme 15/08/2023',
      status: 'REFUSED',
      note: 'NUL ET NON AVENU depuis 15/08/2023',
    },
    {
      code: 'AVIS_IMPO',
      label: "Avis d'imposition 3 dernières années",
      authority: 'DGI',
      legalBasis: 'CFD 2013',
      status: 'CONDITIONAL',
      note: "En complément d'un autre acte présomptif uniquement",
    },
    {
      code: 'PERMIS_HABITER',
      label: "Permis d'habiter",
      authority: 'Mairie',
      legalBasis: 'Ancien régime',
      status: 'CONDITIONAL',
      note: 'Pour transformation en TF uniquement',
    },
    {
      code: 'CERT_INSCRIPTION',
      label: "Certificat d'inscription ANDF/BCDF",
      authority: 'ANDF',
      legalBasis: 'CFD 2013',
      status: 'ACCEPTED',
    },
    {
      code: 'DECISION_JUSTICE',
      label: 'Décision de justice définitive',
      authority: 'Tribunaux',
      legalBasis: 'Code procédure',
      status: 'ACCEPTED',
      note: 'Force probante équivalente TF',
    },
  ];

  /** Section 10B.2 — Côte d'Ivoire (Réformes 2019-2025) */
  private readonly ivoireDocs: LegalDocument[] = [
    {
      code: 'TF',
      label: 'Titre Foncier (TF)',
      authority: 'Conservation Foncière',
      legalBasis: 'Loi 2019-868',
      status: 'ACCEPTED',
    },
    {
      code: 'ACD',
      label: 'Arrêté de Concession Définitive',
      authority: 'Ministère Construction',
      legalBasis: 'Code Urbain 2020',
      status: 'ACCEPTED',
      note: 'Seul acte pleine propriété urbaine',
    },
    {
      code: 'ADU',
      label: "Attestation de Droit d'Usage Coutumier",
      authority: 'AFOR',
      legalBasis: 'Réforme jan. 2025',
      status: 'ACCEPTED',
      note: 'Nouveau document rural obligatoire',
    },
    {
      code: 'CFR_ANCIEN',
      label: 'Certificat Foncier Rural (ancien)',
      authority: 'AFOR',
      legalBasis: 'Loi 98-750',
      status: 'CONDITIONAL',
      note: 'Vérifier date et statut AFOR',
    },
    {
      code: 'LETTRE_ATTR',
      label: "Lettre d'Attribution",
      authority: 'Admin.',
      legalBasis: 'Ancien régime',
      status: 'CONDITIONAL',
      note: 'Uniquement si procédure ACD en cours',
    },
    {
      code: 'APPRO_LOT',
      label: 'Approbation de lotissement',
      authority: 'Mairie',
      legalBasis: 'Code Urbain',
      status: 'CONDITIONAL',
      note: 'En complément TF ou ACD',
    },
    {
      code: 'ATTEST_VILLAGE',
      label: 'Attestation villagioise',
      authority: 'Chef village',
      legalBasis: 'Coutumier',
      status: 'REFUSED',
      note: 'Insuffisante sans ACD ou TF',
    },
  ];

  /** Section 10B.3 — Burkina Faso (Nouvelle RAF oct. 2025) */
  private readonly burkinaDocs: LegalDocument[] = [
    {
      code: 'TF',
      label: 'Titre Foncier (TF)',
      authority: 'DGI',
      legalBasis: 'RAF 2025',
      status: 'ACCEPTED',
    },
    {
      code: 'PUH',
      label: "Permis Urbain d'Habiter",
      authority: 'Services communaux',
      legalBasis: 'RAF 2025',
      status: 'ACCEPTED',
    },
    {
      code: 'APFR',
      label: 'Attestation de Possession Foncière Rurale',
      authority: 'Commune',
      legalBasis: 'RAF 2025 (nouveau)',
      status: 'ACCEPTED',
      note: 'Nouveau document RAF 2025',
    },
    {
      code: 'BAIL_EMPHY',
      label: 'Bail emphytéotique',
      authority: 'État',
      legalBasis: 'RAF 2025 art. 102',
      status: 'ACCEPTED',
      note: '18 à 99 ans',
    },
    {
      code: 'ARRETE_MORCEL',
      label: 'Arrêté de morcellement',
      authority: 'Commune',
      legalBasis: 'RAF 2025',
      status: 'CONDITIONAL',
      note: 'En complément TF ou PUH',
    },
    {
      code: 'CONV_SIMPLE',
      label: 'Convention de vente simple',
      authority: 'Privé',
      legalBasis: 'RAF 2025',
      status: 'REFUSED',
    },
  ];

  /** Section 10B.4 — Togo (CFD 2018 + DCCF mars 2025) */
  private readonly togoDocs: LegalDocument[] = [
    {
      code: 'TF',
      label: 'Titre Foncier (TF)',
      authority: 'ANDF + DCCF (OTR)',
      legalBasis: 'Loi 2018-005 art. 256',
      status: 'ACCEPTED',
      note: 'Unique preuve — définitif, intangible, inattaquable',
    },
    {
      code: 'CESSION_NOTARIE',
      label: 'Acte de cession notarié + immatriculation',
      authority: 'Notaire + DCCF',
      legalBasis: 'CFD art. 161-162',
      status: 'ACCEPTED',
      note: 'Uniquement si immatriculation prouvée',
    },
    {
      code: 'CERT_ANCIEN',
      label: 'Certificat de propriété (ancien régime)',
      authority: 'DCCF',
      legalBasis: 'Pré-2018',
      status: 'CONDITIONAL',
      note: 'Validation DCCF requise',
    },
    {
      code: 'DECISION_JUSTICE',
      label: 'Décision de justice définitive',
      authority: 'Tribunaux',
      legalBasis: 'Code procédure',
      status: 'ACCEPTED',
    },
    {
      code: 'CONV_SEULE',
      label: 'Convention de vente seule',
      authority: 'Privé',
      legalBasis: 'CFD art. 161-162',
      status: 'REFUSED',
      note: 'Invalide sans immatriculation',
    },
    {
      code: 'AVIS_PERTE',
      label: 'Avis de perte de titre foncier',
      authority: 'OTR',
      legalBasis: 'CFD 2018',
      status: 'CONDITIONAL',
      note: 'Accepté provisoirement avec justificatif OTR',
    },
  ];

  /** Section 10B.6 — Validate a document against country matrix */
  validateDocument(
    country: 'BJ' | 'CI' | 'BF' | 'TG',
    documentCode: string,
  ): {
    status: DocumentStatus;
    document: LegalDocument | null;
    action: 'AUTO_ACCEPT' | 'COUNTRY_ADMIN_REVIEW' | 'AUTO_REJECT';
  } {
    const matrix = this.getCountryMatrix(country);
    const doc = matrix.find((d) => d.code === documentCode);

    if (!doc) return { status: 'REFUSED', document: null, action: 'AUTO_REJECT' };

    const action =
      doc.status === 'ACCEPTED'
        ? 'AUTO_ACCEPT'
        : doc.status === 'CONDITIONAL'
          ? 'COUNTRY_ADMIN_REVIEW'
          : 'AUTO_REJECT';

    return { status: doc.status, document: doc, action };
  }

  /** Get full document matrix for a country */
  getCountryMatrix(country: 'BJ' | 'CI' | 'BF' | 'TG'): LegalDocument[] {
    switch (country) {
      case 'BJ':
        return this.beninDocs;
      case 'CI':
        return this.ivoireDocs;
      case 'BF':
        return this.burkinaDocs;
      case 'TG':
        return this.togoDocs;
    }
  }

  /** Section 10B.5 — Comparative table across Phase 1 countries */
  getComparativeTable() {
    return {
      BJ: {
        mainLaw: 'CFD 2013 mod. 2024',
        keyDoc: 'Titre Foncier obligatoire',
        noTF: 'INTERDIT depuis 15/08/2023',
        notaryRequired: true,
        foreignOwnership: 'Autorisé (OHADA)',
      },
      CI: {
        mainLaw: 'Loi 2019 + CFD Urbain 2020',
        keyDoc: 'TF ou ACD (urbain), ADU (rural)',
        noTF: 'INTERDIT sans ACD ou TF',
        notaryRequired: true,
        foreignOwnership: 'Restrictions rurales',
      },
      BF: {
        mainLaw: 'RAF oct. 2025 (214 art.)',
        keyDoc: 'TF, PUH ou APFR',
        noTF: 'Possible via PUH ou APFR',
        notaryRequired: true,
        foreignOwnership: 'INTERDIT foncier rural',
      },
      TG: {
        mainLaw: 'CFD juin 2018 + DCCF mars 2025',
        keyDoc: 'TF + immatriculation préalable',
        noTF: 'INTERDIT (art. 161-162)',
        notaryRequired: true,
        foreignOwnership: 'Autorisé avec immatriculation',
      },
    };
  }
}
