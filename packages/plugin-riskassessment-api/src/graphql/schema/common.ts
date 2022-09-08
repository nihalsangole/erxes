export const commonTypes = `
    createdAt:String
    modifiedAt:String
`;

export const commonPaginateTypes = `
    page:Int
    perPage:Int
    sortField: String,
    sortDirection: Int,
    searchValue: String,
    sortFromDate: String,
    sortToDate: String
`;

export const commonRiskAssessmentTypes = `
    _id: String
    name: String!
    description: String!
    categoryId: String!
`;

export const commonRiskConfirmityTypes = `
    _id: String!,
    cardId: String!,
    riskAssessmentId: String!,
`;

export const commonAssessmentCategoryTypes = `
    _id: String
    name: String
    formId: String
    parentId: String
`;
