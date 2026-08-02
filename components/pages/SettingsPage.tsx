import AtlasMemorySettings from "@/components/settings/AtlasMemorySettings";
import SettingsScreen from "@/components/settings/SettingsScreen";
import WorkspaceThemeSettings, { type WorkspaceTheme } from "@/components/settings/WorkspaceThemeSettings";

export default function SettingsPage({ theme, onThemeChange }: { theme: WorkspaceTheme; onThemeChange: (theme: WorkspaceTheme) => void }) {
  return (
    <div className="space-y-6">
      <WorkspaceThemeSettings theme={theme} onThemeChange={onThemeChange} />
      <SettingsScreen />
      <AtlasMemorySettings />
    </div>
  );
}
