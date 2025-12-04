'use client';

import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';

type Props = {
  spec: Record<string, any>;
};

function ReactScalar({ spec }: Props) {
  return (
    <ApiReferenceReact
      configuration={{
        content: spec,
      }}
    />
  );
}

export default ReactScalar;
