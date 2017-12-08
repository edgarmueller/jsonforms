import { JsonForms } from 'jsonforms-core';
import 'react-dom';
export * from './complex';
export * from './controls';
export * from './layouts';
export * from './fields';

export const materialize = () => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'waves-effect', 'waves-light']
    },
    {
      name: 'control',
      classNames: ['input-field']
    },
    {
      name: 'control.label',
      classNames: ['active']
    },
    {
      name: 'array.button',
      classNames: ['btn-floating', 'waves-effect', 'waves-light', 'array-button']
    },
    {
      name: 'array.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.label',
      classNames: ['group.label']
    },
    {
      name: 'collection',
      classNames: ['collection']
    },
    {
      name: 'item',
      classNames: ['collection-item']
    },
    // {
    //   name: 'item-active',
    //   classNames: ['active']
    // },
    {
      name: 'horizontal-layout',
      classNames: ['row']
    },
    {
      name: 'array.children',
      classNames: ['row']
    },
    {
      name: 'array-table',
      classNames: ['array-table-layout', 'control']
    },
    {
      name: 'categorization',
      classNames: ['jsf-categorization']
    },
    {
      name: 'categorization.master',
      classNames: ['jsf-categorization-master']
    },
    {
      name: 'categorization.detail',
      classNames: ['jsf-categorization-detail']
    },
    {
      name: 'category.group',
      classNames: ['jsf-category-group']
    },
  ]);

  const calcClasses = childrenSize => {
    const colSize = Math.floor(12 / childrenSize[0]);

    return ['col', `s${colSize}`];
  };

  JsonForms.stylingRegistry.register({
    name: 'horizontal-layout-item',
    classNames: calcClasses
  });

  JsonForms.stylingRegistry.register({
    name: 'array.item',
    classNames: calcClasses
  });

  JsonForms.stylingRegistry.register({
    name: 'vertical-layout-item',
    classNames: ['vertical-layout-item']
  });
  JsonForms.stylingRegistry.deregister('select');
};

materialize();