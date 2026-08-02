"use client";

import Link from "next/link";

const features = [
  {
    title: "Attendance Tracking",
    description:
      "Mark attendance per class in seconds, see present/absent/unmarked at a glance, and notify parents when a student is away.",
  },
  {
    title: "KCSE-Based Grading",
    description:
      "Enter marks against the real 8-4-4 subject structure — compulsory, humanities, and technical — with grades and points computed automatically.",
  },
  {
    title: "Report Cards & Ranking",
    description:
      "Generate individual or whole-class report card PDFs, with class position, averages, and both teacher and principal comments.",
  },
  {
    title: "Admissions",
    description:
      "Add students with auto-assigned admission numbers that continue from your existing numbering — no manual tracking required.",
  },
  {
    title: "Staff Management",
    description:
      "Add teacher accounts with one-time temporary passwords, and activate or deactivate staff without losing their historical records.",
  },
  {
    title: "Terms & Promotion",
    description:
      "Set the active term once and every screen follows it. Promote a class forward or graduate Form 4 leavers with one action.",
  },
];

const roles = [
  {
    title: "Principal / Director",
    description:
      "Oversee every class from one dashboard — total students and teachers, today's attendance, grades across the school, admissions, staff, and terms.",
  },
  {
    title: "Teacher",
    description:
      "Mark attendance, enter grades for your classes, write report card comments, and generate report cards — all scoped to the classes you teach.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0A500] text-xl font-bold text-[#1A3C5E]">
              S
            </div>
            <span className="text-xl font-semibold text-[#1A3C5E]">ShuleLoop</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#64748B] md:flex">
            <a href="#features" className="hover:text-[#1A3C5E]">Features</a>
            <a href="#roles" className="hover:text-[#1A3C5E]">Who It's For</a>
            <a href="#about" className="hover:text-[#1A3C5E]">About</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#1A3C5E] hover:text-[#16324F]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#1A3C5E] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#16324F]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 lg:flex-row lg:justify-between lg:py-28">
        <div className="max-w-xl">
          <span className="rounded-full bg-[#E8EEF5] px-4 py-2 text-sm font-medium text-[#1A3C5E]">
            School Management, Simplified
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-[#1A3C5E] lg:text-6xl">
            Run Your School.
            <br />
            Keep Everyone in the Loop.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#64748B]">
            ShuleLoop brings attendance, KCSE grading, report cards, and staff
            management into one place built for how Kenyan secondary schools
            actually run.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-[#1A3C5E] px-7 py-3 font-medium text-white transition hover:bg-[#16324F]"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-[#CBD5E1] bg-white px-7 py-3 font-medium text-[#1A3C5E] hover:bg-[#F8FAFC]"
            >
              Learn More
            </a>
          </div>

          <p className="mt-6 text-sm text-[#64748B]">
            Already a member?{" "}
            <Link href="/login" className="font-medium text-[#1A3C5E] hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 w-full max-w-xl lg:mt-0">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A3C5E] text-lg font-bold text-white">
                S
              </div>
              <div>
                <h3 className="font-semibold text-[#1A3C5E]">Principal Dashboard</h3>
                <p className="text-sm text-[#64748B]">School Overview</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["180", "Students"],
                ["12", "Teachers"],
                ["94%", "Present Today"],
                ["5", "Classes"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-[#E2E8F0] p-4">
                  <p className="text-2xl font-semibold text-[#1A3C5E]">{value}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-[#E2E8F0] p-4">
              <p className="text-sm text-[#64748B]">Attendance Today</p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div className="h-full w-[94%] rounded-full bg-[#1A3C5E]" />
              </div>
              <p className="mt-2 text-sm font-medium text-[#1A3C5E]">
                94% of students present
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-[#1A3C5E]">Everything You Need</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#64748B]">
            Built around real school workflows — attendance, grading, and
            report cards that match how your school already operates.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="mb-3 text-lg font-semibold text-[#1A3C5E]">{feature.title}</h3>
              <p className="leading-7 text-[#64748B]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section id="roles" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold text-[#1A3C5E]">Built for Your Team</h2>
            <p className="mt-4 text-[#64748B]">
              Two roles, each seeing exactly what they need — nothing more.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {roles.map((role) => (
              <div key={role.title} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                <h3 className="mb-3 font-semibold text-[#1A3C5E]">{role.title}</h3>
                <p className="text-sm leading-7 text-[#64748B]">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10">
          <div className="grid gap-10 md:grid-cols-4">
            {[
              ["Built for KCSE", "Grading structured around the real 8-4-4 subject and grading system, not a generic scale."],
              ["Secure by Design", "Role-based access means teachers and principals only ever see what's theirs."],
              ["Real-Time", "Attendance, grades, and reports reflect what's happening right now, not last week."],
              ["Easy to Use", "No training manual required — built to feel obvious from the first login."],
            ].map(([title, desc]) => (
              <div key={title}>
                <h3 className="text-lg font-semibold text-[#1A3C5E]">{title}</h3>
                <p className="mt-2 text-sm text-[#64748B]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#1A3C5E] px-10 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Attendance, grading, and report cards — all in one place, built
            for your school.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex rounded-lg bg-white px-8 py-3 font-medium text-[#1A3C5E] transition hover:bg-slate-100"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-lg border border-white/30 px-8 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Already a member? Login
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-[#64748B] md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A3C5E] font-bold text-white">
              S
            </div>
            <span className="font-medium text-[#1A3C5E]">ShuleLoop</span>
          </div>
          <p>A product of Digistar Tech</p>
          <p>© 2026 ShuleLoop. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}