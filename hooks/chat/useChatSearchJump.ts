import { useCallback, useState } from 'react';
import type { Message } from '@/types/chat';

export function useChatSearchJump(params: {
  messages: Message[];
  hasMore: boolean | undefined;
  loadOlder: () => Promise<unknown>;
  scrollToIndex: (index: number) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');

  const onSelectMessage = useCallback(
    async (m: Message) => {
      setVisible(false);
      for (let i = 0; i < 20; i++) {
        const idx = params.messages.findIndex((x) => x.id === m.id);
        if (idx >= 0) {
          params.scrollToIndex(idx);
          return;
        }
        if (!params.hasMore) return;
        await params.loadOlder();
      }
    },
    [params]
  );

  return {
    searchVisible: visible,
    setSearchVisible: setVisible,
    searchValue: value,
    setSearchValue: setValue,
    onSelectMessage,
  };
}


