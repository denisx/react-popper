// @flow strict
import { type Node, useContext, useCallback, useEffect } from 'react';
import warning from 'warning';
import { ManagerReferenceNodeSetterContext } from './Manager';
import { safeInvoke, unwrapArray, setRef } from './utils';
import { type Ref } from './RefTypes';

export type ReferenceChildrenProps = $ReadOnly<{ ref: Ref }>;
export type ReferenceProps = $ReadOnly<{|
  children: (ReferenceChildrenProps) => Node,
  innerRef?: Ref,
|}>;

export function Reference({ children, innerRef }: ReferenceProps): Node {
  const setReferenceNode = useContext(ManagerReferenceNodeSetterContext);

  const refHandler = useCallback(
    (node: ?HTMLElement) => {
      setRef(innerRef, node);
      safeInvoke(setReferenceNode, node);
    },
    [innerRef, setReferenceNode]
  );

  useEffect(() => {
    warning(
      Boolean(setReferenceNode),
      '`Reference` should not be used outside of a `Manager` component.'
    );
  }, [setReferenceNode]);

  return unwrapArray(children)({ ref: refHandler });
}
