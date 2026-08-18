import { useNavigate, useSearch, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";

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

function OptionsFilter({
  item,
  selected,
  isLoading,
  onToggle,
}: {
  item: SpecTemplateItem;
  selected: string[];
  isLoading: boolean;
  onToggle: (key: string, option: string) => void;
}) {
  const options = item.options || [];
  if (options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            disabled={isLoading}
            onClick={() => onToggle(item.key, opt)}
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
  );
}

function BooleanFilter({
  item,
  navigate,
  isLoading,
}: {
  item: SpecTemplateItem;
  navigate: ReturnType<typeof useNavigate>;
  isLoading: boolean;
}) {
  const search = useSearch({ strict: false }) as Record<string, string | undefined>;
  const isActive = search[item.key] === "true";

  const handleToggle = () => {
    navigate({
      search: (prev: Record<string, unknown>) => {
        const updated = { ...prev, page: undefined };
        if (isActive) {
          delete updated[item.key];
        } else {
          updated[item.key] = "true";
        }
        return updated;
      },
      replace: true,
    });
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleToggle}
      aria-pressed={isActive}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium transition-colors disabled:cursor-not-allowed ${
        isActive
          ? "bg-ash/15 text-ash"
          : "bg-transparent text-ash/60 hover:text-ash"
      }`}
    >
      <span
        className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition-colors ${
          isActive ? "bg-ash" : "bg-ash/30"
        }`}
      >
        <span
          className={`h-3 w-3 rounded-full bg-white transition-transform ${
            isActive ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      {item.label || item.key}
    </button>
  );
}

function TextFilter({
  item,
  navigate,
  isLoading,
}: {
  item: SpecTemplateItem;
  navigate: ReturnType<typeof useNavigate>;
  isLoading: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const initialValue = search[item.key] || "";

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(search[item.key] || "");
  }, [search[item.key]]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        navigate({
          search: (prev: Record<string, unknown>) => {
            const updated = { ...prev, page: undefined };
            if (v.trim()) {
              updated[item.key] = v.trim();
            } else {
              delete updated[item.key];
            }
            return updated;
          },
          replace: true,
        });
      }, 300);
    },
    [navigate, item.key],
  );

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      disabled={isLoading}
      placeholder={`Cari ${(item.label || item.key).toLowerCase()}...`}
      className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-[12px] text-ink placeholder:text-ash/50 transition-colors focus:border-ink focus:outline-none disabled:cursor-not-allowed"
    />
  );
}

export default function CategorySidebar({
  specTemplate = [],
}: CategorySidebarProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isPending = useRouterState({ select: (s) => s.status === "pending" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoading = isMounted ? isPending : true;

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

  const renderFilter = (item: SpecTemplateItem) => {
    const type = item.type || "options";

    if (type === "boolean") {
      return (
        <BooleanFilter
          item={item}
          navigate={navigate}
          isLoading={isLoading}
        />
      );
    }

    if (type === "text") {
      return (
        <TextFilter item={item} navigate={navigate} isLoading={isLoading} />
      );
    }

    return (
      <OptionsFilter
        item={item}
        selected={getSelected(item.key)}
        isLoading={isLoading}
        onToggle={toggleOption}
      />
    );
  };

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

              return (
                <li key={item.id || item.key || idx} className="text-sm">
                  <span className="mb-2 block font-medium text-ink capitalize">
                    {label}
                  </span>
                  {renderFilter(item)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
