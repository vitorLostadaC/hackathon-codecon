import { BrowserWindow, screen } from "electron";
import { join } from "path";
import { is } from "@electron-toolkit/utils";

const windowType = (): "toolbar" | "desktop" | "dock" => {
  switch (process.platform) {
    case "win32":
      return "toolbar";
    case "linux":
      return "dock"; // Use dock type for Linux to avoid desktop type issues
    default:
      return "desktop";
  }
};

export function createGearWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;
  const { x: screenX, y: screenY } = primaryDisplay.bounds;

  const gearWindow = new BrowserWindow({
    width: 48,
    height: 48,
    x: screenX + screenWidth - 68, // Absolute position: display X coordinate + width - offset
    y: screenY + 20, // Absolute position: display Y coordinate + offset
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    hasShadow: false,
    type: windowType(),
    show: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the gear icon page
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    gearWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}/gear`);
  } else {
    gearWindow.loadFile(join(__dirname, "../renderer/gear.html"));
  }

  // Platform-specific z-index handling (igual ao overlay)
  const setAlwaysOnTopByPlatform = (): void => {
    if (process.platform === "darwin") {
      gearWindow.setAlwaysOnTop(true, "floating", 1);
    } else {
      gearWindow.setAlwaysOnTop(true, "screen-saver", 1);
    }
  };

  // Show window after it's fully loaded and configured
  gearWindow.once("ready-to-show", () => {
    gearWindow.show();
    setAlwaysOnTopByPlatform();

    // Garantir posicionamento correto após mostrar
    gearWindow.setPosition(screenX + screenWidth - 68, screenY + 20);
  });

  // Prevent the window from being shown in Mission Control
  gearWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  return gearWindow;
}
