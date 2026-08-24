"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";

import {
  getActivePosReminders,
  type PosReminder,
} from "@/lib/supabase/pos-reminders";

export default function PosReminderTicker() {
  const [reminders, setReminders] = useState<
    PosReminder[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD REMINDERS
  // =========================
  useEffect(() => {
    let isMounted = true;

    async function loadReminders() {
      try {
        const data =
          await getActivePosReminders();

        if (!isMounted) {
          return;
        }

        setReminders(data ?? []);
      } catch (error) {
        console.error(
          "Gagal memuat reminder:",
          error
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReminders();

    const interval = window.setInterval(
      loadReminders,
      10000
    );

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  // =========================
  // HIDE IF EMPTY
  // =========================
  if (loading || reminders.length === 0) {
    return null;
  }

  const reminderText = reminders
    .map(
      (item) => `🔔 ${item.message}`
    )
    .join("     •     ");

  return (
    <>
      <div className="relative z-20 flex h-11 w-full shrink-0 overflow-hidden border-y border-pink-200 bg-gradient-to-r from-pink-50 via-orange-50 to-pink-50">

        {/* =====================
            LABEL
        ====================== */}
        <div className="relative z-20 flex h-full shrink-0 items-center gap-2 border-r border-pink-200 bg-white px-3 sm:px-4">

          <span className="reminder-dot" />

          <BellRing
            size={17}
            className="reminder-bell text-pink-600"
          />

          <span className="hidden text-[10px] font-black uppercase tracking-[0.15em] text-pink-600 sm:block">
            Reminder
          </span>
        </div>

        {/* =====================
            RUNNING TEXT
        ====================== */}
        <div className="relative flex min-w-0 flex-1 items-center overflow-hidden">

          <div className="reminder-track">

            <span className="reminder-text">
              {reminderText}
            </span>

            <span
              aria-hidden="true"
              className="reminder-text"
            >
              {reminderText}
            </span>

          </div>
        </div>
      </div>

      <style>{`
        .reminder-track {
          display: flex;
          align-items: center;
          width: max-content;
          white-space: nowrap;
          animation-name: reminderMove;
          animation-duration: 12s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          will-change: transform;
        }

        .reminder-text {
          display: inline-block;
          flex-shrink: 0;
          padding-right: 80px;
          font-size: 12px;
          font-weight: 800;
          color: #be185d;
        }

        .reminder-dot {
          width: 10px;
          height: 10px;
          flex-shrink: 0;
          border-radius: 9999px;
          background: #ec4899;
          animation-name: reminderBlink;
          animation-duration: 0.7s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .reminder-bell {
          flex-shrink: 0;
          animation-name: reminderBell;
          animation-duration: 0.7s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes reminderMove {
          0% {
            transform: translate3d(0, 0, 0);
          }

          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes reminderBlink {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.15;
            transform: scale(0.65);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes reminderBell {
          0% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }

          25% {
            opacity: 0.4;
            transform: rotate(-12deg) scale(0.9);
          }

          50% {
            opacity: 1;
            transform: rotate(12deg) scale(1.05);
          }

          75% {
            opacity: 0.4;
            transform: rotate(-8deg) scale(0.9);
          }

          100% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }
      `}</style>
    </>
  );
}