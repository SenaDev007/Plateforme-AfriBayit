import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaClient, Country, Surveyor, SurveyAssignment, DroneMapping } from '@afribayit/db';

@Injectable()
export class GeoTrustService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  /** Assigns a licensed surveyor to verify a property */
  async assignSurveyor(
    propertyId: string,
    country: Country,
    city?: string,
  ): Promise<SurveyAssignment> {
    const availableSurveyors = await this.prisma.surveyor.findMany({
      where: {
        jurisdiction: country,
        isAvailable: true,
        ...(city ? { city } : {}),
      },
      orderBy: { rating: 'desc' },
    });

    if (availableSurveyors.length === 0) {
      if (city) return this.assignSurveyor(propertyId, country);
      throw new NotFoundException(
        `Aucun géomètre expert disponible pour la juridiction ${country}`,
      );
    }

    const selected = availableSurveyors[0];

    return this.prisma.surveyAssignment.create({
      data: {
        propertyId,
        surveyorId: selected.id,
        status: 'PENDING',
      },
    });
  }

  /** Upload drone mapping data (Orthophoto + Polygon) */
  async saveDroneMapping(data: {
    propertyId: string;
    surveyorId: string;
    orthophotoUrl: string;
    polygonData: any;
    area: number;
    capturedAt: Date;
  }): Promise<DroneMapping> {
    const mapping = await this.prisma.droneMapping.upsert({
      where: { propertyId: data.propertyId },
      create: {
        propertyId: data.propertyId,
        surveyorId: data.surveyorId,
        orthophotoUrl: data.orthophotoUrl,
        polygonData: data.polygonData,
        area: data.area,
        capturedAt: data.capturedAt,
      },
      update: {
        orthophotoUrl: data.orthophotoUrl,
        polygonData: data.polygonData,
        area: data.area,
        capturedAt: data.capturedAt,
      },
    });

    // Mark property as verified by GeoTrust
    await this.prisma.property.update({
      where: { id: data.propertyId },
      data: { isVerified: true },
    });

    return mapping;
  }

  /** Find assignments by surveyor user ID */
  async findAssignmentsByUserId(userId: string): Promise<SurveyAssignment[]> {
    const surveyor = await this.prisma.surveyor.findUnique({ where: { userId } });
    if (!surveyor) throw new NotFoundException('Profil géomètre introuvable.');

    return this.prisma.surveyAssignment.findMany({
      where: { surveyorId: surveyor.id },
      include: {
        property: { include: { owner: { select: { firstName: true, lastName: true } } } },
      },
    });
  }

  /** Get drone mapping for a property */
  async getMappingByProperty(propertyId: string): Promise<DroneMapping | null> {
    return this.prisma.droneMapping.findUnique({
      where: { propertyId },
    });
  }
}
