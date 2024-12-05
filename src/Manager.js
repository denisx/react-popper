// @flow strict
import React, { type Node, type Context, createContext, useEffect, useRef, useCallback, useState } from 'react';

export const ManagerReferenceNodeContext: Context<?Element>  = createContext();
export const ManagerReferenceNodeSetterContext: Context<
  void | ((?Element) => void)
> = createContext();

export type ManagerProps = $ReadOnly<{
  children: Node,
}>;

export function Manager({ children }: ManagerProps): Node {
  const [referenceNode, setReferenceNode] = useState<?Element>(null);

  const hasUnmounted = useRef(false);
  useEffect(() => {
    hasUnmounted.current = false;
    return () => {
      hasUnmounted.current = true;
    };
  }, []);

  const handleSetReferenceNode = useCallback((node) => {
    if (!hasUnmounted.current) {
      setReferenceNode(node);
    }
  }, []);

  return (
    <ManagerReferenceNodeContext.Provider value={referenceNode}>
      <ManagerReferenceNodeSetterContext.Provider
        value={handleSetReferenceNode}
      >
        {children}
      </ManagerReferenceNodeSetterContext.Provider>
    </ManagerReferenceNodeContext.Provider>
  );
}
