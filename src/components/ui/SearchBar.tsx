import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TextInput } from "./TextInput";

interface SearchBarProps<T> {
  label?: string;
  placeholder?: string;
  fetchFn: (query: string) => Promise<T[]>;
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string;
  getItemHref: (item: T) => string;
  debounceMs?: number;
  minQueryLength?: number;
  className?: string;
}

export function SearchBar<T>({
  label = "CARI",
  placeholder = "Ketik untuk mencari...",
  fetchFn,
  renderItem,
  getItemKey,
  getItemHref,
  debounceMs = 300,
  minQueryLength = 2,
  className = "",
}: SearchBarProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    async (q: string) => {
      if (q.length < minQueryLength) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchFn(q);
        setResults(data);
        setIsOpen(data.length > 0);
        setActiveIndex(-1);
      } catch {
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, minQueryLength],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), debounceMs);
  };

  const handleFocus = () => {
    if (results.length > 0) setIsOpen(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const handleDropdownMouseDown = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <TextInput
        label={label}
        name="search"
        fontSize={14}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {query.length >= minQueryLength && (
        <>
          {isLoading && (
            <output
              onMouseDown={handleDropdownMouseDown}
              className="absolute left-0 right-0 top-full mt-1 z-50 bg-paper border border-line rounded-sm shadow-xl block"
            >
              <div className="flex items-center justify-center gap-2 py-5">
                <Loader2 size={18} className="animate-spin text-blue" />
                <span className="text-[13px] text-ash">Mencari...</span>
              </div>
            </output>
          )}

          {!isLoading && isOpen && results.length > 0 && (
            <div
              role="listbox"
              onMouseDown={handleDropdownMouseDown}
              className="absolute left-0 right-0 top-full mt-1 z-50 bg-paper border border-line rounded-sm shadow-xl overflow-hidden"
            >
              <ul className="divide-y divide-line/50">
                {results.map((item, idx) => (
                  <li key={getItemKey(item)}>
                    <Link
                      resetScroll={false}

                      to={getItemHref(item)}
                      className={`flex items-center px-4 py-3 hover:bg-paper-dim transition-colors cursor-pointer ${
                        idx === activeIndex ? "bg-paper-dim" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {renderItem(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isLoading && isOpen && results.length === 0 && (
            <output
              onMouseDown={handleDropdownMouseDown}
              className="absolute left-0 right-0 top-full mt-1 z-50 bg-paper border border-line rounded-sm shadow-xl p-4 text-center text-[13px] text-ash block"
            >
              Tidak ada produk ditemukan
            </output>
          )}
        </>
      )}
    </div>
  );
}
