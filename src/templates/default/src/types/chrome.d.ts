/// <reference types="chrome" />

// 如果安装了 @types/chrome，上面的引用就足够了
// 如果没有安装，这里提供基本的类型定义

declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | { [key: string]: any } | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    }
    
    const local: StorageArea;
    const sync: StorageArea;
  }

  namespace runtime {
    interface MessageSender {
      tab?: any;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    function onMessage(callback: (message: any, sender: MessageSender, sendResponse: (response?: any) => void) => void | boolean): void;
    function onInstalled(callback: (details: { reason: string; previousVersion?: string }) => void): void;
  }
}

