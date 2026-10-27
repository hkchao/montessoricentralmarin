"use client";

import { useContent } from "@/components/admin/ContentProvider";
import { T } from "@/components/T";

function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return normalized ? `tel:+${normalized}` : "tel:";
}

export function PhoneLink({ className = "", labelKey = "contact.phone" }: { className?: string; labelKey?: string }) {
  const { content } = useContent();
  const phone = content.text["contact.phone"] ?? "";
  return (
    <a href={phoneHref(phone)} className={className}>
      <T k={labelKey} fallback={phone} />
    </a>
  );
}

export function EmailLink({ className = "" }: { className?: string }) {
  const { content } = useContent();
  const email = content.text["contact.email"] ?? "";
  return (
    <a href={`mailto:${email}`} className={className}>
      <T k="contact.email" fallback={email} />
    </a>
  );
}

export function AddressText() {
  return (
    <>
      <T k="contact.address.street" />
      <br />
      <T k="contact.address.city" />, <T k="contact.address.state" /> <T k="contact.address.zip" />
    </>
  );
}

export function FullAddressText() {
  return (
    <>
      <T k="contact.address.street" />, <T k="contact.address.city" />, <T k="contact.address.state" />{" "}
      <T k="contact.address.zip" />
    </>
  );
}
