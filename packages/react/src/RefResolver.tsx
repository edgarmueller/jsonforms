import React, { ComponentType, useCallback, useEffect, useState } from 'react';
import { addResolvedRefs, JsonSchema, refResolver } from '@jsonforms/core';
import { JsonFormsStateContext, withJsonFormsContext } from './JsonFormsContext';
import isEqual from 'lodash/isEqual';

export interface RefResolverProps {
  schema?: JsonSchema;
  pointer: string;
  children(resolvedSchema: JsonSchema): any;
  resolveRef?(pointer: string): Promise<JsonSchema>;
}

const RefResolver = ({
  schema,
  pointer,
  children,
  resolveRef
}: RefResolverProps) => {
  const [currentSchema, setSchema] = useState(undefined);

  useEffect(() => {
    if (pointer === undefined) {
      return;
    }
    setSchema(undefined);
    resolveRef(pointer).then((resolved: any) => {
      setSchema(resolved);
    });
  }, [schema, pointer]);

  if (pointer === undefined) {
    return children(schema);
  } if (currentSchema === undefined) {
    return null;
  } else {
    return children(currentSchema);
  }
};

const withContextToRefResolverProps = (
  Component: ComponentType<RefResolverProps>
): ComponentType<RefResolverProps> => ({
  ctx,
  props
}: JsonFormsStateContext & RefResolverProps) => {
    const { refParserOptions } = ctx.core;
    const { dispatch, refs } = ctx;
    const schema = props.schema;
    const [resolved, setResolved] = useState(false);
    const resolveRef = useCallback(pointer => {
      const resolve = async (ptr: string) => {
        if (refs !== undefined && refs.refs) {
          return refs.refs.get(ptr);
        }
        return undefined;
      };
      return resolve(pointer);
    }, [schema, refParserOptions, refs]);
    useEffect(() => {
      if (refs !== undefined && Object.keys(refs).length === 0) {
        const resolve = async () => {
          const resolvedRefs = await refResolver(schema, refParserOptions);
          dispatch(addResolvedRefs(resolvedRefs));
          return resolvedRefs;
        };
        resolve().then(() => setResolved(true));
      } else {
        setResolved(true)
      }
    }, [refs]);
    if (!resolved) {
      return null;
    }
    return (
      <Component
        resolveRef={resolveRef}
        schema={schema}
        {...props}
      />
    );
  };

export const withJsonFormsRefResolverProps = (
  Component: ComponentType<RefResolverProps>
): ComponentType<RefResolverProps> =>
  withJsonFormsContext(
    withContextToRefResolverProps(
      React.memo(
        Component,
        (
          prevProps: RefResolverProps,
          nextProps: RefResolverProps
        ) => isEqual(prevProps, nextProps)
      )
    )
  );

export default withJsonFormsRefResolverProps(RefResolver);
