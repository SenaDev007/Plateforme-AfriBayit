import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class SearchResult {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [SearchResult])
  async search(@Args('query') query: string) {
    // For now, return a placeholder to satisfy the schema generation
    // In a real scenario, this would call the searchService
    return [{ id: '1', title: `Result for ${query}` }];
  }
}
