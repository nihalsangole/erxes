import gql from 'graphql-tag';
import {
  types as checkListTypes,
  queries as checkListQueries,
  mutations as checkListMutations,
} from './schema/checklist';
import {
  types as boardTypes,
  queries as boardQueries,
  mutations as boardMutations,
} from './schema/board';
import {
  types as dealTypes,
  queries as dealQueries,
  mutations as dealMutations,
} from './schema/deal';
import {
  types as plTypes,
  queries as plQueries,
  mutations as plMutations,
} from './schema/pipelineLabel';
import {
  types as ptTypes,
  queries as ptQueries,
  mutations as ptMutations,
} from './schema/pipelineTemplate';
import { types as CommonTypes } from './schema/common';
import { isEnabled } from '@erxes/api-utils/src/serviceDiscovery';

const typeDefs = async () => {
  const contactsEnabled = await isEnabled('contacts');
  const tagsEnabled = await isEnabled('tags');
  const formsEnabled = await isEnabled('forms');

  const isEnabledTable = {
    contacts: contactsEnabled,
    forms: formsEnabled,
    tags: tagsEnabled,
  };

  return gql`
    scalar JSON
    scalar Date

    extend type User @key(fields: "_id") {
      _id: String! @external
    }
  
    extend type Branch @key(fields: "_id") {
          _id: String! @external
    }

    extend type Department @key(fields: "_id") {
          _id: String! @external
    }

    ${
      contactsEnabled
        ? `
        extend type Company @key(fields: "_id") {
          _id: String! @external
        }
  
        extend type Customer @key(fields: "_id") {
          _id: String! @external
        }
      `
        : ''
    }

    ${
      tagsEnabled
        ? `
        extend type Tag @key(fields: "_id") {
          _id: String! @external
        }
      `
        : ''
    }
    
    ${boardTypes(isEnabledTable)}
    ${dealTypes(isEnabledTable)}


    ${plTypes}
    ${ptTypes}
    ${CommonTypes}
    ${checkListTypes}
    
    extend type Query {
      ${boardQueries}
      ${dealQueries}

      ${plQueries}
      ${ptQueries}
      ${checkListQueries}
    }
    
    extend type Mutation {
      ${boardMutations}
      ${dealMutations}
      ${plMutations}
      ${ptMutations}
      ${checkListMutations}
    }
  `;
};

export default typeDefs;
