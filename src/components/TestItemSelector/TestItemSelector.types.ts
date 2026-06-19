import type { Validator, ValidationError } from '@/types/form';
import type { TestItem, TestCategory, TestPackage } from '@/types/patient';

export interface TestItemSelectorProps {
  categories: TestCategory[];
  value?: string[];
  onChange?: (selectedIds: string[], selectedItems: TestItem[]) => void;
  onItemSelect?: (itemId: string) => void;
  onItemDeselect?: (itemId: string) => void;
  onPackageSelect?: (packageId: string) => void;
  onValidate?: (errors: ValidationError[]) => void;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  validators?: Validator[];
  maxSelect?: number;
  showPrice?: boolean;
  allowPackage?: boolean;
  showSelectedSummary?: boolean;
  searchable?: boolean;
  className?: string;
}

export type { TestItem, TestCategory, TestPackage, Validator, ValidationError };
