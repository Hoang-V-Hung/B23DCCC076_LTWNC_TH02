import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption<Value extends string> {
  value: Value;
  label: string;
}

interface SelectFieldProps<Value extends string> {
  id: string;
  label: string;
  value: Value;
  options: readonly SelectOption<Value>[];
  onChange: (value: Value) => void;
  disabled?: boolean;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

export function SelectField<Value extends string>({
  id, label, value, options, onChange, disabled = false,
}: SelectFieldProps<Value>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef({ text: '', time: 0 });
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedOption = options[selectedIndex];
  const menuId = `${id}-options`;

  const measureMenu = useCallback((): MenuPosition | null => {
    const trigger = triggerRef.current;
    if (!trigger) return null;
    const rect = trigger.getBoundingClientRect();
    const optionStep = window.matchMedia('(max-width: 560px)').matches ? 48 : 44;
    const contentHeight = menuRef.current?.scrollHeight ?? options.length * optionStep + 4;
    const above = rect.top - 16;
    const below = window.innerHeight - rect.bottom - 16;
    const placeAbove = below < Math.min(contentHeight, 240) && above > below;
    const maxHeight = Math.max(80, Math.min(332, placeAbove ? above : below));
    const width = Math.min(rect.width, window.innerWidth - 16);
    return {
      width, maxHeight,
      top: placeAbove ? rect.top - 8 - Math.min(contentHeight, maxHeight) : rect.bottom + 8,
      left: Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - width - 8)),
    };
  }, [options.length]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setPosition(measureMenu());
    setOpen(true);
  };

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  useLayoutEffect(() => {
    if (open) setPosition(measureMenu());
  }, [open, measureMenu]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const updatePosition = (event: Event) => {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) return;
      setPosition(measureMenu());
    };
    document.addEventListener('pointerdown', handleOutside);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, measureMenu]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex, id]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!options.length) return;
    if (event.key === 'Escape') {
      setOpen(false);
      event.preventDefault();
      return;
    }
    if (event.key === 'Tab') { setOpen(false); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) openMenu();
      else setActiveIndex((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!open) openMenu();
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
      return;
    }
    if (open && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      selectOption(activeIndex);
      return;
    }
    if (event.key.length === 1 && event.key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const now = Date.now();
      const query = `${now - searchRef.current.time < 600 ? searchRef.current.text : ''}${event.key}`.toLocaleLowerCase('vi');
      searchRef.current = { text: query, time: now };
      const match = options.findIndex((option) => option.label.toLocaleLowerCase('vi').startsWith(query));
      if (match !== -1) {
        event.preventDefault();
        if (!open) openMenu();
        setActiveIndex(match);
      }
    }
  };

  return <div className="field">
    <label className="field-label" htmlFor={id} id={`${id}-label`}>{label}</label>
    <button ref={triggerRef} id={id} type="button" className="select-trigger"
      role="combobox" aria-haspopup="listbox" aria-expanded={open} disabled={disabled || !options.length}
      aria-controls={open ? menuId : undefined}
      aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
      aria-labelledby={`${id}-label ${id}-value`}
      onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={handleKeyDown}>
      <span id={`${id}-value`}>{selectedOption?.label ?? ''}</span>
      <svg className="select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {open && position && createPortal(
      <ul ref={menuRef} id={menuId} role="listbox" aria-labelledby={`${id}-label`}
        className="select-menu" style={position}>
        {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`}
          role="option" aria-selected={option.value === value} className="select-option"
          data-highlighted={index === activeIndex ? '' : undefined}
          onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()}
          onClick={() => selectOption(index)}>
          <span>{option.label}</span>
          <svg className="select-check" data-visible={option.value === value} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
        </li>)}
      </ul>, document.body,
    )}
  </div>;
}
