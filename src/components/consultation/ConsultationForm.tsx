"use client";

import { FormEvent, useMemo, useState } from "react";
import { consultation, contact, serviceGroups } from "@/content/site";

type FormState = {
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  brief: string;
  budget: string;
  timeline: string;
};

const empty: FormState = {
  name: "",
  email: "",
  company: "",
  serviceInterest: "",
  brief: "",
  budget: "",
  timeline: "",
};

type ConsultationFormProps = {
  sourcePage: string;
  idPrefix?: string;
  onSuccess?: () => void;
};

function fieldClass(invalid: boolean) {
  return `mt-2 w-full rounded-[var(--radius-cta)] border bg-transparent px-3 py-2.5 text-[length:var(--type-body)] text-cream outline-none transition-colors ${
    invalid
      ? "border-red/80"
      : "border-cream/25 focus:border-yellow"
  }`;
}

export function ConsultationForm({
  sourcePage,
  idPrefix = "consult",
  onSuccess,
}: ConsultationFormProps) {
  const [values, setValues] = useState<FormState>(empty);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  const serviceOptions = useMemo(
    () =>
      serviceGroups.flatMap((group) =>
        group.items.map((item) => `${group.title} — ${item.title}`),
      ),
    [],
  );

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Please add your name.";
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Please add a valid email.";
    }
    if (!values.serviceInterest.trim()) {
      next.serviceInterest = "Please choose a service.";
    }
    if (!values.brief.trim()) next.brief = "Please add a short brief.";
    return next;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;

    setGeneralError("");
    setSuccess("");
    const localErrors = validate();
    setFieldErrors(localErrors);
    if (Object.keys(localErrors).length) return;

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim() || undefined,
      serviceInterest: values.serviceInterest,
      brief: values.brief.trim(),
      budget: values.budget.trim() || undefined,
      timeline: values.timeline.trim() || undefined,
      sourcePage,
    };

    setPending(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await response.json().catch(() => ({}))) as {
        error?: {
          message?: string;
          fieldErrors?: Record<string, string[]>;
        };
      };

      if (!response.ok) {
        if (json.error?.fieldErrors) {
          const next: Record<string, string> = {};
          for (const [key, messages] of Object.entries(json.error.fieldErrors)) {
            next[key] = messages[0] ?? json.error.message ?? "Please check this field.";
          }
          setFieldErrors(next);
        }
        setGeneralError(
          response.status === 429
            ? "Too many requests. Please wait before submitting again."
            : (json.error?.message ?? "Unable to send the request right now."),
        );
        return;
      }

      setSuccess(consultation.success);
      setValues(empty);
      onSuccess?.();
    } catch {
      setGeneralError("Unable to send the request right now.");
    } finally {
      setPending(false);
    }
  }

  const fid = (name: string) => `${idPrefix}-${name}`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {generalError ? (
        <p role="alert" className="text-sm text-red">
          {generalError}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-sm text-cream/85">
          {success}
        </p>
      ) : null}

      <p>
        <label htmlFor={fid("name")} className="text-sm text-cream/70">
          Name
        </label>
        <input
          id={fid("name")}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? fid("name-error") : undefined}
          className={fieldClass(Boolean(fieldErrors.name))}
        />
        {fieldErrors.name ? (
          <span id={fid("name-error")} className="mt-1 block text-sm text-red">
            {fieldErrors.name}
          </span>
        ) : null}
      </p>

      <p>
        <label htmlFor={fid("email")} className="text-sm text-cream/70">
          Email
        </label>
        <input
          id={fid("email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? fid("email-error") : undefined}
          className={fieldClass(Boolean(fieldErrors.email))}
        />
        {fieldErrors.email ? (
          <span id={fid("email-error")} className="mt-1 block text-sm text-red">
            {fieldErrors.email}
          </span>
        ) : null}
      </p>

      <p>
        <label htmlFor={fid("company")} className="text-sm text-cream/70">
          Company (optional)
        </label>
        <input
          id={fid("company")}
          name="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => setField("company", e.target.value)}
          className={fieldClass(false)}
        />
      </p>

      <p>
        <label htmlFor={fid("service")} className="text-sm text-cream/70">
          Service interest
        </label>
        <select
          id={fid("service")}
          name="serviceInterest"
          required
          value={values.serviceInterest}
          onChange={(e) => setField("serviceInterest", e.target.value)}
          aria-invalid={Boolean(fieldErrors.serviceInterest)}
          aria-describedby={
            fieldErrors.serviceInterest ? fid("service-error") : undefined
          }
          className={`${fieldClass(Boolean(fieldErrors.serviceInterest))} bg-bg`}
        >
          <option value="">Select a service</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldErrors.serviceInterest ? (
          <span id={fid("service-error")} className="mt-1 block text-sm text-red">
            {fieldErrors.serviceInterest}
          </span>
        ) : null}
      </p>

      <p>
        <label htmlFor={fid("brief")} className="text-sm text-cream/70">
          Project brief
        </label>
        <textarea
          id={fid("brief")}
          name="brief"
          required
          rows={5}
          value={values.brief}
          onChange={(e) => setField("brief", e.target.value)}
          aria-invalid={Boolean(fieldErrors.brief)}
          aria-describedby={fieldErrors.brief ? fid("brief-error") : undefined}
          className={`${fieldClass(Boolean(fieldErrors.brief))} resize-y`}
        />
        {fieldErrors.brief ? (
          <span id={fid("brief-error")} className="mt-1 block text-sm text-red">
            {fieldErrors.brief}
          </span>
        ) : null}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <p>
          <label htmlFor={fid("budget")} className="text-sm text-cream/70">
            Budget (optional)
          </label>
          <input
            id={fid("budget")}
            name="budget"
            type="text"
            value={values.budget}
            onChange={(e) => setField("budget", e.target.value)}
            className={fieldClass(false)}
          />
        </p>
        <p>
          <label htmlFor={fid("timeline")} className="text-sm text-cream/70">
            Timeline (optional)
          </label>
          <input
            id={fid("timeline")}
            name="timeline"
            type="text"
            value={values.timeline}
            onChange={(e) => setField("timeline", e.target.value)}
            className={fieldClass(false)}
          />
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-[var(--radius-cta)] bg-yellow px-6 text-base tracking-[-0.04em] text-black transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? consultation.sending : consultation.submit}
        </button>
        <a
          href={`mailto:${contact.email}`}
          className="text-sm text-cream/55 transition-opacity hover:text-cream"
        >
          {consultation.emailFallback}
        </a>
      </div>
    </form>
  );
}
