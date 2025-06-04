import type React from "react";
import { Toggle } from "../components/Toggle";
import { IntervalSelect } from "../components/IntervalSelect";

interface GeneralTabProps {
  printInterval: number;
  onPrintIntervalChange: (value: number) => void;
  familyFriendly: boolean;
  onFamilyFriendlyChange: (value: boolean) => void;
}

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingItem({
  label,
  description,
  children,
}: SettingItemProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-primary text-base">{label}</span>
        {children}
      </div>
      {description && <p className="text-tertiary text-sm">{description}</p>}
    </div>
  );
}

type IntervalSetting = {
  id: string;
  label: string;
  description?: string;
  type: "interval";
  value: number;
  onChange: (value: number) => void;
};

type ToggleSetting = {
  id: string;
  label: string;
  description?: string;
  type: "toggle";
  value: boolean;
  onChange: (value: boolean) => void;
};

type Setting = IntervalSetting | ToggleSetting;

export function GeneralTab({
  printInterval,
  onPrintIntervalChange,
  familyFriendly,
  onFamilyFriendlyChange,
}: GeneralTabProps): React.JSX.Element {
  const settings: Setting[] = [
    {
      id: "printInterval",
      label: "Intervalo de print",
      type: "interval",
      value: printInterval,
      onChange: onPrintIntervalChange,
    },
    {
      id: "familyFriendly",
      label: "Family Friend",
      description: "Seu pato não ficará falando palavrões",
      type: "toggle",
      value: familyFriendly,
      onChange: onFamilyFriendlyChange,
    },
  ];

  const renderSettingControl = (setting: Setting): React.ReactNode => {
    switch (setting.type) {
      case "interval":
        return (
          <IntervalSelect
            value={setting.value as number}
            onChange={setting.onChange}
          />
        );
      case "toggle":
        return (
          <Toggle
            checked={setting.value as boolean}
            onChange={setting.onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 mx-8 pt-4">
      {settings.map((setting) => (
        <SettingItem
          key={setting.id}
          label={setting.label}
          description={setting.description}
        >
          {renderSettingControl(setting)}
        </SettingItem>
      ))}
    </div>
  );
}
