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
import { UnknownRenderer } from './UnknownRenderer';
import {
    DispatchFieldProps,
    formatErrorMessage,
    mapStateToDispatchFieldProps,
} from '@jsonforms/core';
import { FormHelperText } from '@material-ui/core';

/**
 * Dispatch renderer component for fields.
 */
class Dispatch extends React.Component<DispatchFieldProps, any> {
    render() {
        const { uischema, schema, path, fields, id, errors, isValid, showError } = this.props;
        const field = _.maxBy(fields, r => r.tester(uischema, schema));

        if (field === undefined || field.tester(uischema, schema) === -1) {
            return <UnknownRenderer type={'field'}/>;
        } else {
            const Field = field.field;

            return (
                <React.Fragment>
                    <Field
                        uischema={uischema}
                        schema={schema}
                        path={path}
                        id={id}
                    />
                    {
                        showError &&
                        <FormHelperText error={!isValid}>
                            {!isValid && formatErrorMessage(errors)}
                        </FormHelperText>
                    }
                </React.Fragment>
            );
        }
    }
}

export const DispatchField = connect(mapStateToDispatchFieldProps)(Dispatch);
