"use client";

import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Student Management",
    description:
      "Manage admissions, student profiles, academic records, and class enrollment from one place.",
  },
  {
    title: "Attendance Tracking",
    description:
      "Record attendance in real time and keep parents informed with instant updates.",
  },
  {
    title: "Academic Management",
    description:
      "Manage exams, grades, report cards, and performance analytics with ease.",
  },
  {
    title: "Fee Management",
    description:
      "Track payments, balances, invoices, and school finances securely.",
  },
  {
    title: "Communication",
    description:
      "Connect teachers, parents, students, and administrators on one platform.",
  },
  {
    title: "Reports & Analytics",
    description:
      "Gain valuable insights into attendance, academics, and school operations.",
  },
];

const roles = [
  {
    title: "Administrators",
    description:
      "Manage students, teachers, classes, attendance, examinations, fees, and school operations from one centralized dashboard.",
  },
  {
    title: "Teachers",
    description:
      "Record attendance, manage classes, enter examination results, and communicate with parents.",
  },
  {
    title: "Parents",
    description:
      "Stay informed by viewing your child's attendance, examination results, fee balances, announcements, and academic progress in one place.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            {/* Replace with your logo later */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A3C5E] text-xl font-bold text-white">
              S
            </div>

            <span className="text-xl font-semibold text-[#1A3C5E]">
              Shule Loop
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#64748B] md:flex">
            <a href="#features" className="hover:text-[#1A3C5E]">
              Features
            </a>

            <a href="#roles" className="hover:text-[#1A3C5E]">
              Who It's For
            </a>

            <a href="#about" className="hover:text-[#1A3C5E]">
              About
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-lg bg-[#1A3C5E] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#16324F]"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 lg:flex-row lg:justify-between lg:py-28">
        <div className="max-w-xl">
          <span className="rounded-full bg-[#E8EEF5] px-4 py-2 text-sm font-medium text-[#1A3C5E]">
            Modern School Management System
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-[#1A3C5E] lg:text-6xl">
            Manage Your School.
            <br />
            Keep Everyone in the Loop.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#64748B]">
            Shule Loop is a modern school management platform that connects
            administrators, teachers, parents, and students through one secure,
            intuitive system.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
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
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 w-full max-w-xl lg:mt-0">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A3C5E] text-lg font-bold text-white">
                S
              </div>

              <div>
                <h3 className="font-semibold text-[#1A3C5E]">
                  Shule Loop Dashboard
                </h3>

                <p className="text-sm text-[#64748B]">
                  School Overview
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["1,248", "Students"],
                ["82", "Teachers"],
                ["96%", "Attendance"],
                ["12", "Classes"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#E2E8F0] p-4"
                >
                  <p className="text-2xl font-semibold text-[#1A3C5E]">
                    {value}
                  </p>

                  <p className="mt-1 text-sm text-[#64748B]">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-[#E2E8F0] p-4">
              <p className="text-sm text-[#64748B]">
                Attendance Today
              </p>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div className="h-full w-[96%] rounded-full bg-[#1A3C5E]" />
              </div>

              <p className="mt-2 text-sm font-medium text-[#1A3C5E]">
                96% Students Present
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-[#1A3C5E]">
            Everything You Need
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#64748B]">
            Simplify school administration with powerful tools designed for
            modern educational institutions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="mb-3 text-lg font-semibold text-[#1A3C5E]">
                {feature.title}
              </h3>

              <p className="leading-7 text-[#64748B]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section id="roles" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold text-[#1A3C5E]">
              Built for Everyone
            </h2>

            <p className="mt-4 text-[#64748B]">
              One platform connecting every member of your school community.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role.title}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6"
              >
                <h3 className="mb-3 font-semibold text-[#1A3C5E]">
                  {role.title}
                </h3>

                <p className="text-sm leading-7 text-[#64748B]">
                  {role.description}
                </p>
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
              "Cloud-Based",
              "Secure",
              "Real-Time Updates",
              "Easy to Use",
            ].map((item) => (
              <div key={item}>
                <h3 className="text-lg font-semibold text-[#1A3C5E]">
                  {item}
                </h3>

                <p className="mt-2 text-sm text-[#64748B]">
                  Designed to help schools operate efficiently from anywhere.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#1A3C5E] px-10 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">
            Ready to Transform Your School?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Experience a smarter way to manage attendance, academics, finances,
            and communication—all in one platform.
          </p>

          <Link
            href="/login"
            className="mt-10 inline-flex rounded-lg bg-white px-8 py-3 font-medium text-[#1A3C5E] transition hover:bg-slate-100"
          >
            Login to Shule Loop
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-[#64748B] md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A3C5E] font-bold text-white">
              S
            </div>

            <span className="font-medium text-[#1A3C5E]">
              Shule Loop
            </span>
          </div>

          <p>A product of Digistar Tech Solutions</p>

          <p>© 2026 Shule Loop. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}