import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Check, FlaskConical, Package, X, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, Checkbox, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import type { TestItemSelectorProps, TestItem, TestCategory } from './TestItemSelector.types';
import type { ValidationError } from '@/types/form';

export const TestItemSelector: React.FC<TestItemSelectorProps> = ({
  categories,
  value = [],
  onChange,
  onItemSelect,
  onItemDeselect,
  onPackageSelect,
  onValidate,
  required = false,
  readOnly = false,
  disabled = false,
  maxSelect,
  showPrice = true,
  allowPackage = true,
  showSelectedSummary = true,
  searchable = true,
  className
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(value);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

  const allItems = useMemo(() => {
    const items: TestItem[] = [];
    for (const category of categories) {
      for (const item of category.items) {
        items.push(item);
      }
    }
    return items;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.map(category => ({
      ...category,
      items: category.items.filter(
        item => 
          item.name.toLowerCase().includes(query) ||
          item.code.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      )
    })).filter(category => category.items.length > 0);
  }, [categories, searchQuery]);

  const activeCategoryData = useMemo(() => {
    return filteredCategories.find(c => c.id === activeCategory) || filteredCategories[0];
  }, [filteredCategories, activeCategory]);

  const selectedItems = useMemo(() => {
    return allItems.filter(item => selectedIds.includes(item.id));
  }, [allItems, selectedIds]);

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0);
  }, [selectedItems]);

  const isItemSelected = useCallback((itemId: string) => {
    return selectedIds.includes(itemId);
  }, [selectedIds]);

  const isCategoryAllSelected = useCallback((category: TestCategory) => {
    return category.items.every(item => selectedIds.includes(item.id));
  }, [selectedIds]);

  const isCategoryPartiallySelected = useCallback((category: TestCategory) => {
    const selectedInCategory = category.items.filter(item => selectedIds.includes(item.id)).length;
    return selectedInCategory > 0 && selectedInCategory < category.items.length;
  }, [selectedIds]);

  const toggleItem = useCallback((itemId: string) => {
    if (readOnly || disabled) return;

    let newSelectedIds: string[];
    
    if (selectedIds.includes(itemId)) {
      newSelectedIds = selectedIds.filter(id => id !== itemId);
      onItemDeselect?.(itemId);
    } else {
      if (maxSelect && selectedIds.length >= maxSelect) {
        setError(`最多只能选择 ${maxSelect} 个项目`);
        return;
      }
      newSelectedIds = [...selectedIds, itemId];
      onItemSelect?.(itemId);
    }

    setSelectedIds(newSelectedIds);
    setError(null);
    
    const items = allItems.filter(item => newSelectedIds.includes(item.id));
    onChange?.(newSelectedIds, items);
  }, [selectedIds, readOnly, disabled, maxSelect, allItems, onChange, onItemSelect, onItemDeselect]);

  const toggleCategory = useCallback((category: TestCategory) => {
    if (readOnly || disabled) return;

    const categoryItemIds = category.items.map(item => item.id);
    const allSelected = isCategoryAllSelected(category);
    
    let newSelectedIds: string[];
    
    if (allSelected) {
      newSelectedIds = selectedIds.filter(id => !categoryItemIds.includes(id));
      categoryItemIds.forEach(id => onItemDeselect?.(id));
    } else {
      const itemsToAdd = categoryItemIds.filter(id => !selectedIds.includes(id));
      if (maxSelect && selectedIds.length + itemsToAdd.length > maxSelect) {
        setError(`最多只能选择 ${maxSelect} 个项目`);
        return;
      }
      newSelectedIds = [...selectedIds, ...itemsToAdd];
      itemsToAdd.forEach(id => onItemSelect?.(id));
    }

    setSelectedIds(newSelectedIds);
    setError(null);
    
    const items = allItems.filter(item => newSelectedIds.includes(item.id));
    onChange?.(newSelectedIds, items);
  }, [selectedIds, readOnly, disabled, maxSelect, isCategoryAllSelected, allItems, onChange, onItemSelect, onItemDeselect]);

  const selectPackage = useCallback((packageId: string, itemIds: string[]) => {
    if (readOnly || disabled) return;

    if (maxSelect && itemIds.length > maxSelect) {
      setError(`该套餐包含 ${itemIds.length} 个项目，超过最大选择数 ${maxSelect}`);
      return;
    }

    const newSelectedIds = [...new Set([...selectedIds, ...itemIds])];
    setSelectedIds(newSelectedIds);
    setError(null);
    
    const items = allItems.filter(item => newSelectedIds.includes(item.id));
    onChange?.(newSelectedIds, items);
    onPackageSelect?.(packageId);
  }, [selectedIds, readOnly, disabled, maxSelect, allItems, onChange, onPackageSelect]);

  const clearAll = useCallback(() => {
    if (readOnly || disabled) return;
    setSelectedIds([]);
    setError(null);
    onChange?.([], []);
  }, [readOnly, disabled, onChange]);

  const validate = useCallback(() => {
    const errors: ValidationError[] = [];
    if (required && selectedIds.length === 0) {
      errors.push({ field: 'testItems', message: '请至少选择一个检验项目' });
      setError('请至少选择一个检验项目');
    } else {
      setError(null);
    }
    onValidate?.(errors);
    return errors;
  }, [required, selectedIds, onValidate]);

  useEffect(() => {
    (window as any).validateTestItems = validate;
    return () => {
      delete (window as any).validateTestItems;
    };
  }, [validate]);

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-medical-purple-100 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-medical-purple-600" />
          </div>
          <div>
            <CardTitle>检验项目选择</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">
              已选择 {selectedIds.length} 项
              {maxSelect && ` / 最多 ${maxSelect} 项`}
            </p>
          </div>
        </div>
      </CardHeader>

      {searchable && (
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索检验项目名称、编码..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-medical-blue-500 focus:shadow-input-focus"
              disabled={disabled}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="px-6 py-2 bg-medical-red-50 text-medical-red-600 text-sm border-b border-medical-red-100">
          {error}
        </div>
      )}

      <CardBody className="p-0">
        <div className="flex h-[400px]">
          <div className="w-48 border-r border-slate-100 overflow-y-auto scrollbar-thin">
            {filteredCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'w-full px-4 py-3 text-left text-sm transition-colors border-l-2',
                  activeCategory === category.id
                    ? 'bg-medical-blue-50 border-l-medical-blue-500 text-medical-blue-700 font-medium'
                    : 'border-l-transparent hover:bg-slate-50 text-slate-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{category.name}</span>
                  <span className="text-xs text-slate-400 ml-2">
                    {category.items.filter(item => selectedIds.includes(item.id)).length}/{category.items.length}
                  </span>
                </div>
              </button>
            ))}
            
            {allowPackage && activeCategoryData?.packages && activeCategoryData.packages.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase">
                  推荐套餐
                </div>
                {activeCategoryData.packages.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => selectPackage(pkg.id, pkg.itemIds)}
                    disabled={readOnly || disabled}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-medical-orange-500 flex-shrink-0" />
                      <span className="truncate font-medium">{pkg.name}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{pkg.itemIds.length} 项</span>
                      <span className="text-medical-orange-600 font-medium">
                        {formatCurrency(pkg.discountPrice || pkg.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {activeCategoryData && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h4 className="text-sm font-semibold text-slate-700">
                    {activeCategoryData.name}
                  </h4>
                  {!readOnly && !disabled && (
                    <Checkbox
                      checked={isCategoryAllSelected(activeCategoryData)}
                      indeterminate={isCategoryPartiallySelected(activeCategoryData)}
                      onChange={() => toggleCategory(activeCategoryData)}
                      label="全选"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  {activeCategoryData.items.map(item => {
                    const selected = isItemSelected(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all',
                          selected
                            ? 'bg-medical-blue-50 border border-medical-blue-200'
                            : 'hover:bg-slate-50 border border-transparent',
                          (readOnly || disabled) && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                            selected
                              ? 'bg-medical-blue-500 border-medical-blue-500'
                              : 'border-slate-300'
                          )}>
                            {selected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-700">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {item.code}
                              {item.description && ` · ${item.description}`}
                            </div>
                          </div>
                        </div>
                        {showPrice && (
                          <div className="text-sm font-medium text-medical-orange-600">
                            {formatCurrency(item.price)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {activeCategoryData.items.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <FlaskConical className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">暂无匹配的检验项目</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>

      {showSelectedSummary && selectedItems.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-700">
              已选项目 ({selectedItems.length})
            </div>
            {!readOnly && !disabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-medical-red-500 hover:text-medical-red-600 hover:bg-medical-red-50"
              >
                <X className="w-4 h-4" />
                清空选择
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedItems.slice(0, 10).map(item => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-medical-blue-100 text-medical-blue-700 rounded-full"
              >
                {item.name}
                {!readOnly && !disabled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className="hover:bg-medical-blue-200 rounded p-0.5 -mr-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {selectedItems.length > 10 && (
              <span className="inline-flex items-center px-2.5 py-1 text-xs text-slate-500">
                +{selectedItems.length - 10} 项
              </span>
            )}
          </div>
          {showPrice && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-sm text-slate-600">合计金额</span>
              <span className="text-lg font-semibold text-medical-orange-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default TestItemSelector;
