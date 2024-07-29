import gql from 'graphql-tag';
import { isEnabled } from '@erxes/api-utils/src/serviceDiscovery';
import { types, queries, mutations } from './schema/automation';

const typeDefs = async () => {


  return gql`
    scalar JSON
    scalar Date

    ${types()}

    extend type Query {
      ${queries}
    }

    extend type Mutation {
      ${mutations}
    }
  `;
};

export default typeDefs;
