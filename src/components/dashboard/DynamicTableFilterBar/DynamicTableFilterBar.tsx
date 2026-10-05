'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';
import { cn } from '@/lib/utils';
import { ITableFilter } from '@/types/table-filter.types';
import { Search, X } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

interface DynamicTableFilterBarProps {
  fields: ITableFilter[];
}

const DynamicTableFilterBarContent = ({ fields }: DynamicTableFilterBarProps) => {
  const { setMultipleQueries, getQueryObject } = useSetSearchQueryInURL();
  const queryParams = getQueryObject();

  const searchField = fields.find((f) => f.type === 'search');
  const rawSearch = queryParams.search;
  const currentSearchUrl = (Array.isArray(rawSearch) ? rawSearch[0] : rawSearch) || '';

  const [searchInputValue, setSearchInputValue] = useState(currentSearchUrl);
  const debouncedSearch = useDebounce(searchInputValue, 500);

  const [prevSearchUrl, setPrevSearchUrl] = useState(currentSearchUrl);
  if (currentSearchUrl !== prevSearchUrl) {
    setPrevSearchUrl(currentSearchUrl);
    setSearchInputValue(currentSearchUrl);
  }

  useEffect(() => {
    if (debouncedSearch !== currentSearchUrl) {
      setMultipleQueries({ search: (debouncedSearch as string) || undefined, page: 1 });
      if (searchField?.onChange) searchField.onChange(debouncedSearch as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, currentSearchUrl]);

  const filterFields = fields.filter((f) => f.type === 'select');

  return (
    <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {searchField && (
          <div className="relative w-full sm:w-auto">
            <Search
              size={15}
              className="text-secondary-text absolute top-1/2 left-4 -translate-y-1/2"
            />
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder={searchField.placeholder || 'Search...'}
              className="focus:border-primary border-border bg-card text-primary-text focus:ring-primary/20 w-full rounded-md border py-2.5 pr-4 pl-10 text-sm outline-none focus:ring-2 sm:w-64"
            />
            {searchInputValue && (
              <button
                onClick={() => setSearchInputValue('')}
                className="text-secondary-text hover:text-primary-text absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        {filterFields.map((field) => {
          const paramName = field.name.replace('-filter', '');
          const rawParam = queryParams[paramName];
          const currentFieldValue =
            ((Array.isArray(rawParam) ? rawParam[0] : rawParam) as string) || 'all';

          if (field.type === 'select' && field.options) {
            return (
              <div key={field.name} className="w-full sm:w-44">
                <Select
                  value={currentFieldValue}
                  onValueChange={(val) => {
                    setMultipleQueries({ [paramName]: val === 'all' ? undefined : val, page: 1 });
                    if (field.onChange) field.onChange(val);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      'text-primary-text border-border bg-card h-10! w-full rounded-md border px-3 text-sm font-medium shadow-none transition-all outline-none',
                      'focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0',
                    )}
                  >
                    <SelectValue placeholder={field.placeholder || 'Select option'} />
                  </SelectTrigger>
                  <SelectContent className="text-primary-text border-border bg-card border shadow-md">
                    {field.options.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="focus:text-primary focus:bg-primary/10 cursor-pointer transition-colors"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

const DynamicTableFilterBar = (props: DynamicTableFilterBarProps) => {
  return (
    <Suspense fallback={<div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>}>
      <DynamicTableFilterBarContent {...props} />
    </Suspense>
  );
};

export default DynamicTableFilterBar;
