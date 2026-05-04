'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env['NEXT_PUBLIC_GRAPHQL_URL'] || 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export default function GraphQLProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
