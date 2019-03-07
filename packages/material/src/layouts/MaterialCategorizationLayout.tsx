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
import React from 'react';
import { Hidden, Tab, Tabs } from '@material-ui/core';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import {
  and,
  Categorization,
  getData,
  isVisible,
  JsonFormsState,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  RendererProps,
  StatePropsOfLayout,
  StatePropsOfRenderer,
  Tester,
  UISchemaElement,
  uiTypeIs
} from '@jsonforms/core';
import { RendererComponent } from '@jsonforms/react';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '../util/layout';

export const isSingleLevelCategorization: Tester = and(
    uiTypeIs('Categorization'),
    (uischema: UISchemaElement): boolean => {
      const categorization = uischema as Categorization;

      return categorization.elements && categorization.elements.reduce((acc, e) => acc && e.type === 'Category', true);
    }
);

export const materialCategorizationTester: RankedTester = rankWith(1, isSingleLevelCategorization);
export interface CategorizationState {
    activeCategory: number;
  }

export interface MaterialCategorizationLayoutRendererProps {
    selected?: number;
    ownState?: boolean;
    data: any;
    onChange?(selected: number, prevSelected: number): void;
}

export class MaterialCategorizationLayoutRenderer
    extends RendererComponent<MaterialCategorizationLayoutRendererProps & RendererProps, CategorizationState> {

    state = {
        activeCategory: 0
    };

    render() {
        const { data, uischema, schema, path, visible, selected } = this.props;
        const value  = this.hasOwnState() ? this.state.activeCategory : selected;
        const categorization = uischema as Categorization;

        const childProps: MaterialLayoutRendererProps = {
            elements: categorization.elements[value].elements,
            schema,
            path,
            direction: 'column',
            visible
        };

        const categories = categorization.elements
          .filter(category => isVisible(category, data));

        return (
          <Hidden xsUp={!visible}>
            <AppBar position='static'>
              <Tabs value={value} onChange={this.handleChange} variant='scrollable'>
                {categories.map((e, idx) => <Tab key={idx} label={e.label} />)}
              </Tabs>
            </AppBar>
            <div style={{ marginTop: '0.5em' }}>
              <MaterialLayoutRenderer {...childProps}/>
            </div>
          </Hidden>
        );
    }

    hasOwnState = () => {
        return this.props.ownState !== undefined ? this.props.ownState : true;
    };

    private handleChange = (_event: any, value: any) => {
        if (this.props.onChange) {
            this.props.onChange(value, this.state.activeCategory);
        }
        const hasOwnState = this.hasOwnState();
        if (hasOwnState) {
            this.setState({ activeCategory: value });
        }
    };
}

const mapStateToCategorizationProps = (
  state: JsonFormsState,
  ownProps: StatePropsOfRenderer
): MaterialCategorizationLayoutRendererProps & StatePropsOfLayout => {
  const props = mapStateToLayoutProps(state, ownProps);
  return {
    ...props,
    data: getData(state)
  };
};

export default connect(
  mapStateToCategorizationProps
)(MaterialCategorizationLayoutRenderer);
