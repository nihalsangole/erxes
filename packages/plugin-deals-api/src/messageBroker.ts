import { sendMessage } from '@erxes/api-utils/src/core';
import type {
  MessageArgs,
  MessageArgsOmitService,
} from '@erxes/api-utils/src/core';

import { generateModels } from './connectionResolver';
import {
  generateAmounts,
  generateProducts,
} from './graphql/resolvers/customResolvers/deal';
import { itemsEdit, publishHelper } from './graphql/resolvers/mutations/utils';
import {
  createConformity,
  notifiedUserIds,
  sendNotifications,
} from './graphql/utils';
import { conversationConvertToCard, createBoardItem } from './models/utils';
import { getCardItem } from './utils';
import graphqlPubsub from '@erxes/api-utils/src/graphqlPubsub';
import {
  consumeQueue,
  consumeRPCQueue,
} from '@erxes/api-utils/src/messageBroker';

export const setupMessageConsumers = async () => {
  consumeRPCQueue('deals:editItem', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const objModels = {
      deal: models.Deals,
    };

    const { itemId, processId, type, user, ...doc } = data;

    if (!itemId || !type || !user || !processId) {
      return {
        status: 'error',
        errorMessage: 'you must provide some params',
      };
    }
    const collection = objModels[type];

    const oldItem = await collection.findOne({ _id: itemId });
    const typeUpperCase = type.charAt(0).toUpperCase() + type.slice(1);

    return {
      status: 'success',
      data: await itemsEdit(
        models,
        subdomain,
        itemId,
        type,
        oldItem,
        doc,
        processId,
        user,
        collection[`update${typeUpperCase}`]
      ),
    };
  });

  consumeRPCQueue('deals:createChildItem', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { type, itemId, ...doc } = data;

    const parent = await getCardItem(models, {
      contentType: type,
      contentTypeId: itemId,
    });

    if (!parent) {
      return {
        status: 'error',
        errorMessage: 'Parent not found',
      };
    }

    const childCard = await createBoardItem(
      models,
      subdomain,
      { parentId: itemId, stageId: parent.stageId, ...doc },
      type
    );

    return {
      status: 'success',
      data: childCard,
    };
  });

  consumeRPCQueue('deals:createRelatedItem', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { type, sourceType, itemId, name, stageId } = data;

    const relatedCard = await createBoardItem(
      models,
      subdomain,
      { name, stageId },
      type
    );

    await sendCoreMessage({
      subdomain,
      action: 'conformities.addConformity',
      data: {
        mainType: sourceType,
        mainTypeId: itemId,
        relType: type,
        relTypeId: relatedCard._id,
      },
    });

    return {
      status: 'success',
      data: relatedCard,
    };
  });

  consumeRPCQueue('deals:create', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    const deals = await models.Deals.createDeal(data);

    const { customerId = '' } = data;

    if (customerId) {
      await createConformity(subdomain, {
        customerIds: [customerId],
        mainType: 'deal',
        mainTypeId: deals._id,
      });
    }
    return {
      status: 'success',
      data: deals,
    };
  });

  consumeRPCQueue('deals:remove', async ({ subdomain, data: { _ids } }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Deals.removeDeals(_ids),
    };
  });

  consumeRPCQueue('deals:stages.find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Stages.find(data).sort({ order: 1 }).lean(),
    };
  });

  consumeRPCQueue('deals:stages.findOne', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Stages.findOne(data).lean(),
    };
  });

  consumeRPCQueue('deals:pipelines.find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Pipelines.find(data).lean(),
    };
  });

  consumeRPCQueue('deals:boards.find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Boards.find(data).lean(),
    };
  });

  consumeRPCQueue('deals:boards.findOne', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Boards.findOne(data).lean(),
    };
  });

  consumeRPCQueue(
    'deals:boards.count',
    async ({ subdomain, data: { selector } }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await models.Boards.find(selector).count(),
      };
    }
  );

  consumeQueue(
    'deals:checklists.removeChecklists',
    async ({ subdomain, data: { type, itemIds } }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await models.Checklists.removeChecklists(type, itemIds),
      };
    }
  );

  consumeRPCQueue('deals:conversationConvert', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await conversationConvertToCard(models, subdomain, data),
    };
  });

  consumeRPCQueue('deals:find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    if (!data.query) {
      return {
        status: 'success',
        data: await models.Deals.find(data).lean(),
      };
    }

    const { query, skip, limit, sort = {} } = data;

    return {
      status: 'success',
      data: await models.Deals.find(query)
        .skip(skip || 0)
        .limit(limit || 20)
        .sort(sort)
        .lean(),
    };
  });

  consumeRPCQueue('deals:count', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Deals.find(data).count(),
    };
  });

  consumeRPCQueue('deals:findOne', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Deals.findOne(data).lean(),
    };
  });

  consumeRPCQueue('deals:generateAmounts', async (productsData) => {
    return { data: generateAmounts(productsData), status: 'success' };
  });

  consumeRPCQueue('deals:generateProducts', async ({ subdomain, data }) => {
    return {
      data: await generateProducts(subdomain, data),
      status: 'success',
    };
  });

  consumeRPCQueue('deals:findItem', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return { data: await getCardItem(models, data), status: 'success' };
  });

  consumeRPCQueue(
    'deals:findDealProductIds',
    async ({ subdomain, data: { _ids } }) => {
      const models = await generateModels(subdomain);

      const dealProductIds = await await models.Deals.find({
        'productsData.productId': { $in: _ids },
      }).distinct('productsData.productId');

      return { data: dealProductIds, status: 'success' };
    }
  );

  consumeRPCQueue(
    'deals:updateMany',
    async ({ subdomain, data: { selector, modifier } }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.Deals.updateMany(selector, modifier),
        status: 'success',
      };
    }
  );

  consumeRPCQueue('deals:notifiedUserIds', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await notifiedUserIds(models, data),
    };
  });

  consumeRPCQueue('deals:sendNotifications', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await sendNotifications(models, subdomain, data),
    };
  });

  consumeRPCQueue(
    'deals:getLink',
    async ({ subdomain, data: { _id, type } }) => {
      const models = await generateModels(subdomain);

      const item = await getCardItem(models, {
        contentTypeId: _id,
        contentType: type,
      });

      if (!item) {
        return {
          status: 'error',
          errorMessage: 'Item not found',
        };
      }

      const stage = await models.Stages.getStage(item.stageId);
      const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);
      const board = await models.Boards.getBoard(pipeline.boardId);

      return {
        status: 'success',
        data: `/${stage.type}/board?id=${board._id}&pipelineId=${pipeline._id}&itemId=${_id}`,
      };
    }
  );

  consumeRPCQueue(
    'deals:pipelines.findOne',
    async ({ subdomain, data: { _id, stageId } }) => {
      let pipelineId = _id;
      const models = await generateModels(subdomain);
      if (!pipelineId && stageId) {
        const stage = await models.Stages.findOne({ _id: stageId }).lean();
        if (stage) {
          pipelineId = stage.pipelineId;
        }
      }

      if (!pipelineId) {
        return {
          status: 'error',
          errorMessage: 'Pipeline not found',
        };
      }

      return {
        status: 'success',
        data: await models.Pipelines.getPipeline(pipelineId),
      };
    }
  );

  consumeRPCQueue(
    'deals:pipelineLabels.find',
    async ({ subdomain, data: { query, fields } }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await models.PipelineLabels.find(query, fields),
      };
    }
  );

  consumeQueue(
    'deals:pipelinesChanged',
    async ({ subdomain, data: { pipelineId, action, data } }) => {
      graphqlPubsub.publish('pipelinesChanged', {
        pipelinesChanged: {
          _id: pipelineId,
          proccessId: Math.random(),
          action,
          data,
        },
      });

      return {
        status: 'success',
      };
    }
  );

  consumeQueue(
    'deals:productsDataChanged',
    async ({
      subdomain,
      data: { dealId, action, dataId, doc, productsData },
    }) => {
      graphqlPubsub.publish(`productsDataChanged:${dealId}`, {
        productsDataChanged: {
          _id: dealId,
          proccessId: Math.random(),
          action,
          data: {
            dataId,
            doc,
            productsData,
          },
        },
      });

      return {
        status: 'success',
      };
    }
  );

  consumeQueue(
    'deals:publishHelperItems',
    async ({ subdomain, data: { addedTypeIds, removedTypeIds, doc } }) => {
      const targetTypes = ['deal', 'task', 'ticket', 'purchase'];
      const targetRelTypes = ['company', 'customer'];

      if (
        targetTypes.includes(doc.mainType) &&
        targetRelTypes.includes(doc.relType)
      ) {
        await publishHelper(subdomain, doc.mainType, doc.mainTypeId);
      }

      if (
        targetTypes.includes(doc.relType) &&
        targetRelTypes.includes(doc.mainType)
      ) {
        for (const typeId of addedTypeIds.concat(removedTypeIds)) {
          await publishHelper(subdomain, doc.relType, typeId);
        }
      }

      return {
        status: 'success',
      };
    }
  );

  consumeRPCQueue(
    'deals:getModuleRelation',
    async ({ subdomain, data: { module, target, triggerType } }) => {
      let filter;

      if (module.includes('contacts')) {
        const relTypeIds = await sendCommonMessage({
          subdomain,
          serviceName: 'core',
          action: 'conformities.savedConformity',
          data: {
            mainType: triggerType.split(':')[1],
            mainTypeId: target._id,
            relTypes: [module.split(':')[1]],
          },
          isRPC: true,
          defaultValue: [],
        });

        if (relTypeIds.length) {
          filter = { _id: { $in: relTypeIds } };
        }
      }

      return {
        status: 'success',
        data: filter,
      };
    }
  );
};

export const sendContactsMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'contacts',
    ...args,
  });
};

export const sendInternalNotesMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'internalnotes',
    ...args,
  });
};

export const sendCoreMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'core',
    ...args,
  });
};

export const sendFormsMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'forms',
    ...args,
  });
};

export const sendEngagesMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'engages',
    ...args,
  });
};

export const sendInboxMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'inbox',
    ...args,
  });
};

export const sendProductsMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'products',
    ...args,
  });
};

export const sendNotificationsMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'notifications',
    ...args,
  });
};

export const sendLogsMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'logs',
    ...args,
  });
};

export const sendSegmentsMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'segments',
    ...args,
  });
};

export const sendLoyaltiesMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'loyalties',
    ...args,
  });
};

export const sendCommonMessage = async (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};

export const fetchSegment = (
  subdomain: string,
  segmentId: string,
  options?,
  segmentData?: any
) =>
  sendSegmentsMessage({
    subdomain,
    action: 'fetchSegment',
    data: { segmentId, options, segmentData },
    isRPC: true,
  });

export const sendTagsMessage = async (
  args: MessageArgsOmitService
): Promise<any> => {
  return sendMessage({
    serviceName: 'tags',
    ...args,
  });
};
