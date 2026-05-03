import { Injectable } from '@nestjs/common';
import { Country, PropertyType } from '@afribayit/db';

export interface RequiredDocument {
  type: string;
  label: string;
  description: string;
  isMandatory: boolean;
}

@Injectable()
export class ComplianceService {
  /** Returns the list of mandatory documents required to publish a property in a specific country */
  getRequiredDocuments(country: Country, type: PropertyType): RequiredDocument[] {
    const common = [
      {
        type: 'ID_OWNER',
        label: "Pièce d'identité du propriétaire",
        description: 'CNI, Passeport ou Carte de séjour en cours de validité.',
        isMandatory: true,
      },
    ];

    switch (country) {
      case Country.BJ: // Bénin
        return [
          ...common,
          {
            type: 'TITRE_FONCIER',
            label: 'Titre Foncier (TF)',
            description: "Le titre foncier définitif ou le certificat d'appartenance.",
            isMandatory: type === PropertyType.LAND || type === PropertyType.HOUSE,
          },
          {
            type: 'ATTESTATION_RECASEMENT',
            label: 'Attestation de Recasement',
            description: "Requis si le TF n'est pas encore disponible en zone lotie.",
            isMandatory: false,
          },
        ];

      case Country.CI: // Côte d'Ivoire
        return [
          ...common,
          {
            type: 'ACD',
            label: 'Arrêté de Concession Définitive (ACD)',
            description: "Le document foncier de référence en Côte d'Ivoire.",
            isMandatory: true,
          },
          {
            type: 'EXTRAIT_TOPO',
            label: 'Extrait Topographique',
            description: 'Plan visé par un géomètre expert agréé.',
            isMandatory: type === PropertyType.LAND,
          },
        ];

      case Country.BF: // Burkina Faso
        return [
          ...common,
          {
            type: 'PUH',
            label: "Permis Urbain d'Habiter (PUH)",
            description: 'Le titre de propriété urbain standard au Burkina.',
            isMandatory: true,
          },
          {
            type: 'TITRE_FONCIER',
            label: 'Titre Foncier',
            description: 'Pour une pleine propriété définitive.',
            isMandatory: false,
          },
        ];

      case Country.TG: // Togo
        return [
          ...common,
          {
            type: 'TITRE_FONCIER',
            label: 'Titre Foncier',
            description: 'Document indispensable pour toute transaction sécurisée au Togo.',
            isMandatory: true,
          },
        ];

      default:
        return common;
    }
  }

  /** Validates if the provided document list satisfies the country's requirements */
  validatePropertyCompliance(
    country: Country,
    type: PropertyType,
    providedDocTypes: string[],
  ): { isValid: boolean; missing: string[] } {
    const required = this.getRequiredDocuments(country, type).filter((d) => d.isMandatory);
    const missing = required.filter((r) => !providedDocTypes.includes(r.type)).map((m) => m.label);

    return {
      isValid: missing.length === 0,
      missing,
    };
  }
}
