import { cn } from "@renderer/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "../components/button";

interface AppearanceTabProps {
  selectedTheme: number;
  onThemeChange: (themeIndex: number) => void;
}

export function AppearanceTab({
  selectedTheme,
  onThemeChange,
}: AppearanceTabProps): React.JSX.Element {
  const [initialTheme, setInitialTheme] = useState(selectedTheme);
  const [currentSelection, setCurrentSelection] = useState(selectedTheme);

  useEffect(() => {
    setInitialTheme(selectedTheme);
    setCurrentSelection(selectedTheme);
  }, [selectedTheme]);

  const themes = [
    { id: 1, preview: "theme1.png" },
    { id: 2, preview: "theme2.png" },
    { id: 3, preview: "theme3.png" },
  ];

  const handleThemeChange = (themeId: number) => {
    setCurrentSelection(themeId);
  };

  const handleApplyTheme = () => {
    onThemeChange(currentSelection);
  };

  const isButtonDisabled =
    currentSelection === 0 || currentSelection === initialTheme;

  return (
    <div className="flex flex-col mx-8 pt-6 pb-[9px] items-end h-full">
      <div className="w-full flex-1 space-y-8">
        <h2 className="text-primary text-base">Aparencia</h2>
        <div className="flex gap-9">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="w-[109px] h-[102px] flex items-center justify-center rounded-md bg-gradient-to-t from-accent-from to-accent-to"
            >
              <div
                className={cn(
                  "bg-background-primary rounded-md w-full h-full",
                  currentSelection === theme.id && "w-[105px] h-[98px]"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleThemeChange(theme.id)}
                  className="w-full h-full rounded-md bg-[#D9D9D9]/50 "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant={isButtonDisabled ? "primaryDisabled" : "primary"}
        onClick={handleApplyTheme}
        disabled={isButtonDisabled}
      >
        Escolher
      </Button>
    </div>
  );
}
