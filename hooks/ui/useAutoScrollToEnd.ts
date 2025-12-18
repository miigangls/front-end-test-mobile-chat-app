import { useEffect, type RefObject } from 'react';
import type { FlatList } from 'react-native';

export function useAutoScrollToEnd<T>(
  listRef: RefObject<FlatList<T>>,
  enabled: boolean,
  dependencyKey: unknown
) {
  useEffect(() => {
    if (!enabled) return;
    if (!listRef.current) return;

    const id = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 50);

    return () => clearTimeout(id);
  }, [enabled, dependencyKey, listRef]);
}


