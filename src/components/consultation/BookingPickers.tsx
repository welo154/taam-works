"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/**
 * Branded replacements for the browser's own date picker and option lists,
 * which cannot be restyled (their blue highlights come from the system).
 * Each is a field button with a black, semi-transparent panel under it.
 */

function Chevron() {
  return (
    <Image
      src="/brand/chevron.svg"
      alt=""
      width={11}
      height={20}
      className="booking-chevron"
      aria-hidden="true"
    />
  );
}

type FieldProps = {
  label: string;
  /** Text shown in the field; empty shows the label as a placeholder. */
  display: string;
  invalid: boolean;
  panelClass?: string;
  popup: "listbox" | "dialog";
  children: (close: () => void) => ReactNode;
};

function PickerField({
  label,
  display,
  invalid,
  panelClass = "",
  popup,
  children,
}: FieldProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Closing after a choice hands focus back to the field.
  const [refocus, setRefocus] = useState(0);
  useEffect(() => {
    if (refocus > 0) button.current?.focus();
  }, [refocus]);

  function close() {
    setOpen(false);
    setRefocus((count) => count + 1);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      // Close the panel only, not the whole booking dialog.
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      close();
    }
  }

  return (
    <div
      ref={root}
      className={`booking-field booking-picker${invalid ? " is-invalid" : ""}${open ? " is-open" : ""}`}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        // Focus moved to another field: only one panel is open at a time.
        const next = event.relatedTarget as Node | null;
        if (next && !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className={`booking-picker-button${display ? "" : " is-empty"}`}
        aria-haspopup={popup}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={display ? `${label}: ${display}` : label}

        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {display || label}
      </button>
      <Chevron />
      {open ? (
        <div id={panelId} className={`booking-pop ${panelClass}`}>
          {children(close)}
        </div>
      ) : null}
    </div>
  );
}

/* ── Option list (time, service) ── */

export function SelectField({
  label,
  value,
  options,
  invalid,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <PickerField label={label} display={value} invalid={invalid} popup="listbox">
      {(close) => (
        <OptionList
          label={label}
          value={value}
          options={options}
          onPick={(option) => {
            onChange(option);
            close();
          }}
        />
      )}
    </PickerField>
  );
}

function OptionList({
  label,
  value,
  options,
  onPick,
}: {
  label: string;
  value: string;
  options: string[];
  onPick: (value: string) => void;
}) {
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[role=option]");
    if (!items?.length) return;
    const selected = Math.max(0, options.indexOf(value));
    items[selected].focus();
  }, [options, value]);

  function move(event: KeyboardEvent, index: number) {
    const items = list.current?.querySelectorAll<HTMLElement>("[role=option]");
    if (!items) return;
    let next = index;
    if (event.key === "ArrowDown") next = Math.min(items.length - 1, index + 1);
    else if (event.key === "ArrowUp") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    items[next].focus();
  }

  return (
    <ul ref={list} role="listbox" aria-label={label} className="booking-options">
      {options.map((option, index) => (
        <li
          key={option}
          role="option"
          aria-selected={option === value}
          tabIndex={-1}
          className="booking-option"
          onClick={() => onPick(option)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onPick(option);
            } else {
              move(event, index);
            }
          }}
        >
          {option}
        </li>
      ))}
    </ul>
  );
}

/* ── Calendar ── */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (value: number) => String(value).padStart(2, "0");
const toIso = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

function formatDate(iso: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1].slice(0, 3).toUpperCase()} ${year}`;
}

export function DateField({
  label,
  value,
  min,
  invalid,
  onChange,
}: {
  label: string;
  value: string;
  /** Earliest selectable day, as YYYY-MM-DD. */
  min: string;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <PickerField
      label={label}
      display={formatDate(value)}
      invalid={invalid}
      popup="dialog"
      panelClass="booking-pop-calendar"
    >
      {(close) => (
        <Calendar
          value={value}
          min={min}
          onPick={(day) => {
            onChange(day);
            close();
          }}
        />
      )}
    </PickerField>
  );
}

function Calendar({
  value,
  min,
  onPick,
}: {
  value: string;
  min: string;
  onPick: (value: string) => void;
}) {
  const start = (value || min).split("-").map(Number);
  const [year, setYear] = useState(start[0]);
  const [month, setMonth] = useState(start[1] - 1);
  const grid = useRef<HTMLDivElement>(null);

  const [minYear, minMonth] = min.split("-").map(Number);
  const atFirstMonth = year === minYear && month === minMonth - 1;
  const firstWeekday = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  function shift(by: number) {
    const next = new Date(year, month + by, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  useEffect(() => {
    const target =
      grid.current?.querySelector<HTMLElement>("[aria-pressed=true]") ??
      grid.current?.querySelector<HTMLElement>("button:not(:disabled)");
    target?.focus();
  }, [year, month]);

  function onGridKey(event: KeyboardEvent) {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[
      event.key
    ];
    if (!step) return;
    const buttons = [
      ...(grid.current?.querySelectorAll<HTMLButtonElement>("button") ?? []),
    ];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    const next = buttons[index + step];
    if (next && !next.disabled) next.focus();
  }

  return (
    <div className="booking-calendar" role="group" aria-label="Choose a date">
      <div className="booking-calendar-head">
        <button
          type="button"
          className="booking-calendar-nav"
          onClick={() => shift(-1)}
          disabled={atFirstMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span aria-live="polite">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          className="booking-calendar-nav"
          onClick={() => shift(1)}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="booking-calendar-week" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div ref={grid} className="booking-calendar-grid" onKeyDown={onGridKey}>
        {Array.from({ length: firstWeekday }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: days }, (_, index) => {
          const iso = toIso(year, month, index + 1);
          return (
            <button
              key={iso}
              type="button"
              className={`booking-day${iso === min ? " is-today" : ""}`}
              disabled={iso < min}
              aria-pressed={iso === value}
              aria-label={`${index + 1} ${MONTHS[month]} ${year}`}
              onClick={() => onPick(iso)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
