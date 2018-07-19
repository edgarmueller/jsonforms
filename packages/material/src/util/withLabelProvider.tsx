import * as React from 'react';
import * as _ from 'lodash';
import {
  ControlElement,
  ControlProps,
  ControlState,
  isControl,
  JsonSchema,
  LabelDescription,
  LabelProvider,
  UISchemaElement,
  WithLabelProvider
} from '@jsonforms/core';
const { Component } = React;

// TODO: should be part of core
export const withLabelProvider =
  (labelProvider: LabelProvider) =>
    (JsonFormsComponent): React.Component<WithLabelProvider & ControlProps, ControlState> => {
      class WrappedComponent extends Component<WithLabelProvider & ControlProps, ControlState> {
        render() {
          return (
            <JsonFormsComponent {...this.props} labelProvider={labelProvider} />
          );
        }
      }
      // TODO: typings
      // WrappedComponent.displayName = 'withLabelProvider';
      return WrappedComponent as any;
    };

export const shoutingLabelProvider: LabelProvider =
  (schema: JsonSchema, data: any, uischema?: UISchemaElement) => {

    let desc;

    if (isControl(uischema)) {
      desc = createLabelFrom(uischema);
    }

    if (schema.enum) {
      desc = {
        text: _.camelCase(data),
        show: true
      };
    }

    if (_.has(desc, 'text')) {
      desc.text = desc.text + '!';
    }

    return desc;
  };

// copies of core
const deriveLabel = (controlElement: ControlElement): string => {
  if (controlElement.scope !== undefined) {
    const ref = controlElement.scope;
    const label = ref.substr(ref.lastIndexOf('/') + 1);

    return _.startCase(label);
  }

  return '';
};

export const createLabelFrom = (withLabel: ControlElement): LabelDescription => {
  const labelProperty = withLabel.label;
  const derivedLabel = deriveLabel(withLabel);
  if (typeof labelProperty === 'boolean') {
    if (labelProperty) {
      return {
        text: derivedLabel,
        show: labelProperty
      };
    } else {
      return {
        text: derivedLabel,
        show: labelProperty as boolean
      };
    }
  } else if (typeof labelProperty === 'string') {
    return {
      text: labelProperty as string,
      show: true
    };
  } else if (typeof labelProperty === 'object') {
    const show = labelProperty.hasOwnProperty('show') ? labelProperty.show : true;
    const label = labelProperty.hasOwnProperty('text') ?
      labelProperty.text : derivedLabel;

    return {
      text: label,
      show
    };
  } else {
    return {
      text: derivedLabel,
      show: true
    };
  }
};
