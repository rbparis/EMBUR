"use client";

export type WorkspaceTheme = "light" | "night" | "system" | "contrast";

const themes: Array<{
  id: WorkspaceTheme;
  name: string;
  description: string;
  colors: string[];
}> = [
  { id: "light", name: "Light", description: "Bright, clean, and easy during the day.", colors: ["#f7f9fd", "#ffffff", "#246bfe", "#ff6a3d"] },
  { id: "night", name: "Ember Night", description: "Deep blue with a controlled ember glow.", colors: ["#020b1d", "#071832", "#4f8cff", "#ff6a3d"] },
  { id: "system", name: "System", description: "Follows this device automatically.", colors: ["#f7f9fd", "#071832", "#246bfe", "#a8b9d4"] },
  { id: "contrast", name: "High Contrast", description: "Stronger separation and larger visual signals.", colors: ["#000000", "#ffffff", "#0057ff", "#ff4d00"] },
];

export default function WorkspaceThemeSettings({ theme, onThemeChange }: { theme: WorkspaceTheme; onThemeChange: (theme: WorkspaceTheme) => void }) {
  return (
    <section className="theme-settings-card rounded-3xl border border-[#d8e1ee] bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1555c6]">Appearance</p>
      <h3 className="font-display mt-3 text-3xl font-semibold text-[#06142f]">Make the workspace yours.</h3>
      <p className="mt-2 text-[#66758d]">The EMBUR brand stays consistent. Choose how the working space feels.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {themes.map((item) => {
          const selected = item.id === theme;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onThemeChange(item.id)}
              className={`theme-choice rounded-2xl border p-4 text-left transition ${selected ? "border-[#246bfe] bg-[#edf3ff] shadow-[0_0_0_3px_rgba(36,107,254,0.12)]" : "border-[#d8e1ee] bg-white hover:border-[#8fb4ff]"}`}
            >
              <span className="flex gap-1.5" aria-hidden="true">{item.colors.map((color) => <span key={color} className="h-7 flex-1 rounded-md border border-black/10" style={{ backgroundColor: color }} />)}</span>
              <span className="mt-4 flex items-center justify-between gap-2"><span className="font-bold text-[#06142f]">{item.name}</span>{selected && <span className="rounded-full bg-[#246bfe] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Active</span>}</span>
              <span className="mt-2 block text-sm leading-5 text-[#66758d]">{item.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
