import {
  putCreateLog as commonPutCreateLog,
  putUpdateLog as commonPutUpdateLog,
  putDeleteLog as commonPutDeleteLog,
  putActivityLog as commonPutActivityLog,
  LogDesc,
  IDescriptions,
} from '@erxes/api-utils/src/logUtils';
import { IModels } from './connectionResolver';

export const LOG_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

const gatherTagNames = async (prevList?: LogDesc[]) => {
  const options: LogDesc[] = prevList || [];

  return options;
};

const gatherDescriptions = async (
  models: IModels,
  params: any,
): Promise<IDescriptions> => {
  const { action, object, updatedDocument } = params;

  const description = `"${object.name}" has been ${action}d`;
  let extraDesc: LogDesc[] = await gatherTagNames();

  if (updatedDocument) {
    extraDesc = await gatherTagNames(extraDesc);
  }

  return { extraDesc, description };
};

export const putDeleteLog = async (models, subdomain, logDoc, user) => {
  const { description, extraDesc } = await gatherDescriptions(models, {
    ...logDoc,
    action: LOG_ACTIONS.DELETE,
  });

  await commonPutDeleteLog(
    subdomain,
    { ...logDoc, description, extraDesc, type: `tags:${logDoc.type}` },
    user,
  );
};

export const putUpdateLog = async (models, subdomain, logDoc, user) => {
  const { description, extraDesc } = await gatherDescriptions(models, {
    ...logDoc,
    action: LOG_ACTIONS.UPDATE,
  });

  await commonPutUpdateLog(
    subdomain,
    { ...logDoc, description, extraDesc, type: `tags:${logDoc.type}` },
    user,
  );
};

export const putCreateLog = async (models, subdomain, logDoc, user) => {
  const { description, extraDesc } = await gatherDescriptions(models, {
    ...logDoc,
    action: LOG_ACTIONS.CREATE,
  });

  await commonPutCreateLog(
    subdomain,
    { ...logDoc, description, extraDesc, type: `tags:${logDoc.type}` },
    user,
  );
};

export const putActivityLog = async (
  subdomain: string,
  params: { action: string; data: any },
) => {
  const { data } = params;

  const updatedParams = {
    ...params,
    data: { ...data, contentType: `tags:${data.contentType}` },
  };

  return commonPutActivityLog(subdomain, {
    ...updatedParams,
  });
};

export default {};
