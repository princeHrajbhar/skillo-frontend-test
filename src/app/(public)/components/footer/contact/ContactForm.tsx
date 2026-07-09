"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL: FormState = {
  name: "", email: "", phone: "", subject: "", message: "",
};

export default function ContactForm() {
  const [form, setForm]       = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // TODO: replace with actual API call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setForm(INITIAL);
  };

  const field = (
    key: keyof FormState,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className={`px-4 py-3 rounded-xl border text-sm outline-none transition-all
          focus:border-[#016AB7] focus:ring-2 focus:ring-[#016AB7]/20
          ${errors[key] ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
      />
      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"style={{ backgroundColor: "#07163b" }}>
          <Send className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">Message Sent!</h3>
        <p className="text-slate-500 max-w-sm">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm font-semibold text-[#016AB7] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        {field("name",  "Full Name",     "text",  "Your full name")}
        {field("email", "Email Address", "email", "you@example.com")}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {field("phone",   "Phone (optional)", "tel",  "+91 98XXX XXXXX")}
        {field("subject", "Subject",          "text", "How can we help?")}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-700">Message</label>
        <textarea
          rows={5}
          value={form.message}
          placeholder="Write your message here..."
          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          className={`px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all
            focus:border-[#016AB7] focus:ring-2 focus:ring-[#016AB7]/20
            ${errors.message ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed" style={{ backgroundColor: "#016AB7" }}
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
          : <><Send className="w-4 h-4" /> Send Message</>
        }
      </button>
    </form>
  );
}
