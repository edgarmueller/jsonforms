/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import {
  computeLabel,
  ControlProps,
  ControlState,
  formatErrorMessage,
  isControl,
  isDescriptionHidden,
  isPlainLabel,
  JsonSchema,
  mapStateToControlProps,
  NOT_APPLICABLE,
  RankedTester,
  rankWith,
  UISchemaElement
} from '@jsonforms/core';
import { Control, DispatchField } from '@jsonforms/react';

import { InputLabel } from '@material-ui/core';
import { FormControl, FormHelperText } from '@material-ui/core';
import { shoutingLabelProvider, withLabelProvider } from '../util/withLabelProvider';

export class MaterialInputControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      description,
      errors,
      label,
      uischema,
      schema,
      visible,
      required,
      parentPath,
      config,
      fields
    } = this.props;
    const isValid = errors.length === 0;
    const trim = config.trim;
    const style: {[x: string]: any} = {};

    if (!visible) {
      style.display = 'none';
    }
    const inputLabelStyle: {[x: string]: any} = {
      whiteSpace: 'nowrap',
      overflow : 'hidden',
      textOverflow: 'ellipsis',
      // magic width as the label is transformed to 75% of its size
      width: '125%'
    };

    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);
    const field = _.maxBy(fields, r => r.tester(uischema, schema));
    if (field === undefined || field.tester(uischema, schema) === NOT_APPLICABLE) {
      console.warn('No applicable field found.');
      return null;
    } else {

      return (
        <FormControl
          style={style}
          fullWidth={!trim}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          <InputLabel htmlFor={id} error={!isValid} style={inputLabelStyle}>
            {computeLabel(isPlainLabel(label) ? label : label.default, required)}
          </InputLabel>
          <DispatchField uischema={uischema} schema={schema} path={parentPath} />
          <FormHelperText error={!isValid}>
            {!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
          </FormHelperText>
        </FormControl>
      );
    }
  }
}

// TODO: move definitions
const Reader = computation => ({
  get: (...ctx) => computation(...ctx),
  map: f => Reader(ctx => f(computation(ctx))),
  orElse: f => Reader((...ctx) => {
    const res = computation(...ctx);
    const alternative = f(...ctx);
    return res === undefined ? alternative : res;
  })
});

// Running this reader will just return `x`.
Reader.prototype.of = x => Reader(() => x);

const higherPrioLabelProvider =
  Reader(
    (schema: JsonSchema, data: any, uischema?: UISchemaElement) => {
      const labelDesc = shoutingLabelProvider(schema, data, uischema);
      if (labelDesc !== undefined && labelDesc.text) {
        labelDesc.text = _.toUpper(labelDesc.text);
      }
      // TODO:
      return labelDesc;
      // return undefined;
    }
  );

export const materialInputControlTester: RankedTester = rankWith(1, isControl);
export default withLabelProvider((higherPrioLabelProvider.orElse(shoutingLabelProvider)).get)(
    connect(mapStateToControlProps, null)(MaterialInputControl)
) as any;
