import brands from "./brands";
import configs from "./configs";
import conformity from "./conformities";
import {
  permissionMutations as permissions,
  usersGroupMutations as usersGroups
} from "./permissions";
import robot from "./robot";
import users from "./users";
import structures from "./structures";
import apps from "./apps";
import organizations from "./organizations";
import tags from "./tags";
import internalNotes from "./internalNotes";
import segments from "./segments";
import forms from "./forms";
import company from "./company";
import customer from "./customer";
import products from "./products";
import productConfigs from "./productConfigs";
import uoms from "./uoms";

import {
  fieldMutations as fields,
  fieldsGroupsMutations as fieldsgroups
} from "./fields";

export default {
  ...users,
  ...brands,
  ...configs,
  ...conformity,
  ...permissions,
  ...usersGroups,
  ...robot,
  ...structures,
  ...apps,
  ...organizations,
  ...tags,
  ...internalNotes,
  ...segments,
  ...forms,
  ...fields,
  ...fieldsgroups,
  ...company,
  ...customer,
  ...products,
  ...productConfigs,
  ...uoms
};
