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
import { NgRedux } from '@angular-redux/store';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNgRedux } from '@angular-redux/store/testing';
import {
    booleanBaseTest,
    booleanErrorTest,
    booleanInputEventTest,
    setupMockStore
} from '@jsonforms/angular-test';
import { IonicModule, Label, Platform, Toggle } from 'ionic-angular';
import { BooleanToggleControlRenderer, booleanToggleControlTester } from '../src';
import { PlatformMock } from '../test-config/mocks-ionic';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { Subject } from 'rxjs';
import { DebugElement } from '@angular/core';

describe('Ionic boolean toggle tester', () => {
  const uischema = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
          toggle: true
      }
  };

  it('should succeed', () => {
      expect(
          booleanToggleControlTester(
              uischema,
              {
                  type: 'object',
                  properties: {
                      foo: {
                          type: 'boolean'
                      }
                  }
              }
          )
      ).toBe(3);
  });
});

const imports = [IonicModule.forRoot(BooleanToggleControlRenderer)];
const providers = [
    { provide: Platform, useClass: PlatformMock },
    { provide: NgRedux, useFactory: MockNgRedux.getInstance }
];
const componentUT: any = BooleanToggleControlRenderer;
const errorTest = {errorInstance: Label, numberOfElements: 2, indexOfElement: 1};
const testConfig = {imports, providers, componentUT};

describe('Boolean toggle base tests', booleanBaseTest(testConfig, Toggle));
describe('Boolean toogle', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BooleanToggleControlRenderer
            ],
            imports: [
                IonicModule.forRoot(BooleanToggleControlRenderer),
            ],
            providers: [
                {provide: Platform, useClass: PlatformMock},
                {provide: NgRedux, useFactory: MockNgRedux.getInstance},
            ],
        }).compileComponents();

        MockNgRedux.reset();
        fixture = TestBed.createComponent(BooleanToggleControlRenderer);
    });

    const data = { foo: true };
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'boolean'
            }
        }
    };
    const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/foo',
        options: {
            toggle: true
        }
    };

    it('should support update via input event', async(() => {
        fixture.detectChanges();
        const component = fixture.componentInstance;
        spyOn<any>(component, 'onChange');
        const mockSubStore: Subject<any> = setupMockStore(fixture, { data, schema, uischema });
        mockSubStore.complete();
        component.ngOnInit();
        const button: DebugElement = fixture.debugElement.query(By.css('button'));

        button.nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onChange).toHaveBeenCalled();
        });
    }));
});

describe('Boolean toggle error tests', booleanErrorTest(testConfig, Toggle, errorTest));
