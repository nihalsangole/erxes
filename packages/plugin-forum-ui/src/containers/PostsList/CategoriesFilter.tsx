import React from 'react';
import { useQuery } from 'react-apollo';
import { queries } from '../../graphql';
import gql from 'graphql-tag';
import { useSearchParam } from '../../hooks';
import CategoryFilter from '../../components/posts/CategoriesFilter';

export default function CategoriesFilter() {
  const { data, loading, error } = useQuery(gql(queries.categoriesAll));
  const [_categoryId, setCategoryId] = useSearchParam('categoryId');

  if (loading) {
    return null;
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const forumCategories = data.forumCategories || [];

  return <CategoryFilter categories={forumCategories} />;
}
