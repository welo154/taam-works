"use client";

import { FormEvent, useMemo, useState } from "react";
import { DateField, SelectField } from "@/components/consultation/BookingPickers";
import { contact, serviceGroups } from "@/content/site";

const TIMES = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

type Errors = Partial<Record<"date" | "time" | "service" | "name" | "phone", string>>;

export function BookingForm({ sourcePage }: { sourcePage: string }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [general, setGeneral] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const minDate = useMemo(() => today(), []);
  const services = serviceGroups.map((group) => group.title);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setGeneral("");

    const next: Errors = {};
    if (!date) next.date = "Choose a date.";
    if (!time) next.time = "Choose a time.";
    if (!service) next.service = "Choose a service.";
    if (!name.trim()) next.name = "Add your name.";
    if (!/^[+\d][\d\s().-]{6,}$/.test(phone.trim())) {
      next.phone = "Add a phone number.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          serviceInterest: service,
          preferredDate: date,
          preferredTime: time,
          sourcePage,
          website,
        }),
      });
      if (!response.ok) {
        const json = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        setGeneral(
          response.status === 429
            ? "Too many requests. Please wait before trying again."
            : (json.error?.message ?? "Unable to send the request right now."),
        );
        return;
      }
      setDone(true);
    } catch {
      setGeneral("Unable to send the request right now.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <p className="booking-done" role="status">
        Thank you, {name.trim().split(" ")[0]}. We have your request and will
        contact you to confirm your consultation.
      </p>
    );
  }

  const firstError = Object.values(errors)[0];

  return (
    <form onSubmit={onSubmit} noValidate className="booking-form">
      <div className="booking-row booking-row-3">
        <DateField
          label="DATE"
          value={date}
          min={minDate}
          invalid={Boolean(errors.date)}
          onChange={setDate}
        />
        <SelectField
          label="TIME"
          value={time}
          options={TIMES}
          invalid={Boolean(errors.time)}
          onChange={setTime}
        />
        <SelectField
          label="SERVICE"
          value={service}
          options={services}
          invalid={Boolean(errors.service)}
          onChange={setService}
        />
      </div>

      <div className="booking-row booking-row-2">
        <label className={`booking-field${errors.name ? " is-invalid" : ""}`}>
          <span className="sr-only">Name</span>
          <input
            type="text"
            name="name"
            placeholder="NAME"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
        </label>
        <label className={`booking-field${errors.phone ? " is-invalid" : ""}`}>
          <span className="sr-only">Phone</span>
          <input
            type="tel"
            name="phone"
            placeholder="PHONE"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
        </label>
      </div>

      <p aria-hidden="true" className="booking-trap">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
      </p>

      {firstError || general ? (
        <p role="alert" className="booking-error">
          {general || firstError}{" "}
          {general ? (
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          ) : null}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="booking-submit">
        <span>{pending ? "SENDING…" : "BOOK NOW"}</span>
      </button>
      <p className="booking-note">
        Please provide your information and someone will contact you confirming
        your consultation.
      </p>
    </form>
  );
}
