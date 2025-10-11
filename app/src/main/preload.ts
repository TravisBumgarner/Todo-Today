import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { FromRenderer, FromMain, Invokes } from "../shared/types";

async function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return await new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = "loaders-css__square-spin";
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: rgb(76, 125, 165);
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background: rgb(215, 227, 232);
  justify-content: center;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);

const electronHandler = {
  ipcRenderer: {
    // Renderer → Main (fire and forget)
    send<T extends keyof FromRenderer>(channel: T, params: FromRenderer[T]) {
      ipcRenderer.send(channel, params);
    },

    // Main → Renderer (listen)
    on<T extends keyof FromMain>(
      channel: T,
      listener: (params: FromMain[T]) => void
    ) {
      const subscription = (_event: IpcRendererEvent, params: FromMain[T]) =>
        listener(params);

      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },

    // Main → Renderer (one-time listen)
    once<T extends keyof FromMain>(
      channel: T,
      listener: (params: FromMain[T]) => void
    ) {
      ipcRenderer.once(channel, (_event, params: FromMain[T]) =>
        listener(params)
      );
    },

    // Renderer → Main (invoke / handle roundtrip)
    invoke<T extends keyof Invokes>(
      channel: T,
      args: Invokes[T]["args"] | undefined = undefined
    ): Promise<Invokes[T]["result"]> {
      return ipcRenderer.invoke(channel, args);
    },
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
