// components/CategorySidebar.tsx
import { useNavigate, useSearch, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react"; // <-- 1. Import ini

export interface SpecTemplateItem {
  id?: string;
  key: string;
  label?: string;
  type?: string;
  options?: string[];
}

interface CategorySidebarProps {
  specTemplate?: SpecTemplateItem[];
}

export default function CategorySidebar({
  specTemplate = [],
}: CategorySidebarProps) {
  const navigate = useNavigate();

  // Strict false for cross-route reusability
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;

  const isPending = useRouterState({
    select: (s) => s.status === "pending",
  });

  // --- SOLUSI HYDRATION MISMATCH ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sebelum mounted (termasuk SSR), kita asumsikan 'true' agar SAMA dengan server.
  // Setelah mounted di browser, baru kita ikuti status isPending dari router.
  const isLoading = isMounted ? isPending : true;
  // ---------------------------------

  const getSelected = (key: string): string[] => {
    const val = search[key];
    return val ? val.split(",").filter(Boolean) : [];
  };

  const toggleOption = (key: string, option: string) => {
    const current = getSelected(key);
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];

    navigate({
      search: (prev: Record<string, unknown>) => {
        const updated = { ...prev, page: undefined };

        if (next.length === 0) {
          delete updated[key];
        } else {
          updated[key] = next.join(",");
        }

        return updated;
      },
      replace: true,
    });
  };

  const clearAll = () => {
    // Preserves existing query params while removing filter keys from specTemplate
    navigate({
      search: (prev: Record<string, unknown>) => {
        const updated = { ...prev, page: undefined };
        for (const item of specTemplate) {
          delete updated[item.key];
        }
        return updated;
      },
      replace: true,
    });
  };

  const activeCount = specTemplate.reduce(
    (sum, item) => sum + getSelected(item.key).length,
    0,
  );

  return (
    <aside className="lg:col-span-1">
      <div
        className={`space-y-8 lg:sticky lg:top-32 ${
          isLoading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {activeCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-ash">{activeCount} filter aktif</span>
            <button
              type="button"
              onClick={clearAll}
              disabled={isLoading}
              className="text-xs font-medium text-ink underline underline-offset-2 hover:text-ash disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        )}

        {specTemplate.length > 0 && (
          <ul className="space-y-6 border-l border-line pl-4">
            {specTemplate.map((item, idx) => {
              const label = item.label || item.key;
              const options = item.options || [];
              if (options.length === 0) return null;

              const selected = getSelected(item.key);

              return (
                <li key={item.id || item.key || idx} className="text-sm">
                  <span className="mb-2 block font-medium text-ink capitalize">
                    {label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {options.map((opt) => {
                      const isActive = selected.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isLoading}
                          onClick={() => toggleOption(item.key, opt)}
                          aria-pressed={isActive}
                          className={`inline-flex items-center rounded px-2 py-1 text-[11px] transition-colors disabled:cursor-not-allowed ${
                            isActive
                              ? "bg-ink text-white"
                              : "bg-line/40 text-ash hover:bg-line/70"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
