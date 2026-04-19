import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

interface PropertyDoc {
  id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  purpose: string;
  type: string;
  price: number;
  currency: string;
  surface?: number;
  bedrooms?: number;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  publishedAt?: string;
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private readonly client: Client;
  private readonly INDEX = 'afribayit_properties';

  constructor(private readonly config: ConfigService) {
    this.client = new Client({
      node: config.get<string>('ELASTICSEARCH_URL', 'http://localhost:9200'),
      auth: {
        username: config.get<string>('ELASTICSEARCH_USERNAME', 'elastic'),
        password: config.get<string>('ELASTICSEARCH_PASSWORD', ''),
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.ensureIndex();
    } catch (error) {
      this.logger.warn('Elasticsearch not available — search degraded to DB.', error);
    }
  }

  /** Index a property document */
  async indexProperty(property: PropertyDoc): Promise<void> {
    await this.client.index({
      index: this.INDEX,
      id: property.id,
      document: property,
    });
  }

  /** Full-text search with geo and filters */
  async search(params: {
    q?: string;
    city?: string;
    purpose?: string;
    type?: string;
    prixMin?: number;
    prixMax?: number;
    lat?: number;
    lon?: number;
    radiusKm?: number;
    from?: number;
    size?: number;
  }): Promise<{ hits: PropertyDoc[]; total: number }> {
    const must: object[] = [{ term: { isVerified: true } }];
    const filter: object[] = [];

    if (params.q) {
      must.push({
        multi_match: {
          query: params.q,
          fields: ['title^3', 'description', 'city^2'],
          fuzziness: 'AUTO',
        },
      });
    }

    if (params.city) filter.push({ match: { city: params.city } });
    if (params.purpose) filter.push({ term: { purpose: params.purpose } });
    if (params.type) filter.push({ term: { type: params.type } });

    if (params.prixMin || params.prixMax) {
      filter.push({
        range: { price: { gte: params.prixMin, lte: params.prixMax } },
      });
    }

    if (params.lat && params.lon) {
      filter.push({
        geo_distance: {
          distance: `${params.radiusKm ?? 20}km`,
          location: { lat: params.lat, lon: params.lon },
        },
      });
    }

    const result = await this.client.search<PropertyDoc>({
      index: this.INDEX,
      from: params.from ?? 0,
      size: params.size ?? 12,
      query: { bool: { must, filter } },
      sort: [{ _score: 'desc' }, { publishedAt: 'desc' }],
    });

    const hits = result.hits.hits.map((h) => h._source!);
    const total = typeof result.hits.total === 'number'
      ? result.hits.total
      : (result.hits.total?.value ?? 0);

    return { hits, total };
  }

  /** Remove a property from the index */
  async removeProperty(id: string): Promise<void> {
    await this.client.delete({ index: this.INDEX, id });
  }

  private async ensureIndex(): Promise<void> {
    const exists = await this.client.indices.exists({ index: this.INDEX });
    if (exists) return;

    await this.client.indices.create({
      index: this.INDEX,
      mappings: {
        properties: {
          title: { type: 'text', analyzer: 'french' },
          description: { type: 'text', analyzer: 'french' },
          city: { type: 'keyword' },
          country: { type: 'keyword' },
          purpose: { type: 'keyword' },
          type: { type: 'keyword' },
          price: { type: 'double' },
          currency: { type: 'keyword' },
          surface: { type: 'double' },
          bedrooms: { type: 'integer' },
          isVerified: { type: 'boolean' },
          publishedAt: { type: 'date' },
          location: { type: 'geo_point' },
        },
      },
    });

    this.logger.log(`Elasticsearch index '${this.INDEX}' created.`);
  }
}
