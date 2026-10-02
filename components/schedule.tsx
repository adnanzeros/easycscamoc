'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import scheduleData from '@/data/cscaSchedule.json';
import './schedule.css';

type Language = 'en' | 'bn';

type Session = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  durationMinutes: number;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const translations = {
  en: {
    badge: 'OFFICIAL EXAM SCHEDULE',
    title: 'CSCA Exam Schedule',
    subtitle:
      'Stay updated with the official CSCA examination sessions for 2026–2027.',

    nextExam: 'Next Examination',
    startsIn: 'Starts In',

    beijing: 'Beijing Time',
    dhaka: 'Dhaka Time',

    officialTime: 'Official Time',
    localTime: 'Dhaka Local Time',

    schedule: 'Examination Schedule',
    scheduleSubtitle:
      'All official examination sessions for the 2026–2027 academic year.',

    duration: 'Duration',
    minutes: 'minutes',

    important: 'Important Information',

    timezoneInfo:
      'Exam times are officially announced in Beijing Time (UTC+8).',

    localInfo:
      'Dhaka Time (UTC+6) is automatically converted from the official Beijing schedule.',

    notice: 'NOTE:',

    mockTest: 'Prepare with CSCA Mock Tests',

    mockTestText:
      'Practice Mathematics, Physics and Chemistry with our CSCA mock tests.',

    startMock: 'Start Mock Test',

    days: 'Days',
    hours: 'Hours',
    mins: 'Mins',
    secs: 'Secs',

    completed: 'Completed',
    upcoming: 'Upcoming',

    subject: 'Subject',
    date: 'Date',
  },

  bn: {
    badge: 'অফিশিয়াল পরীক্ষার সময়সূচি',

    title: 'CSCA পরীক্ষার সময়সূচি',

    subtitle: '২০২৬–২০২৭ শিক্ষাবর্ষের অফিসিয়াল CSCA পরীক্ষার সময়সূচি দেখুন।',

    nextExam: 'পরবর্তী পরীক্ষা',
    startsIn: 'পরীক্ষা শুরু হবে',

    beijing: 'বেইজিং সময়',
    dhaka: 'ঢাকা সময়',

    officialTime: 'অফিশিয়াল সময়',
    localTime: 'ঢাকা স্থানীয় সময়',

    schedule: 'পরীক্ষার সময়সূচি',

    scheduleSubtitle: '২০২৬–২০২৭ শিক্ষাবর্ষের সকল অফিসিয়াল পরীক্ষার সেশন।',

    duration: 'সময়কাল',
    minutes: 'মিনিট',

    important: 'গুরুত্বপূর্ণ তথ্য',

    timezoneInfo:
      'পরীক্ষার অফিসিয়াল সময় বেইজিং সময় (UTC+8) অনুযায়ী দেওয়া হয়েছে।',

    localInfo:
      'অফিশিয়াল বেইজিং সময় থেকে ঢাকা সময় (UTC+6) স্বয়ংক্রিয়ভাবে দেখানো হয়েছে।',

    notice: 'বিশেষ দ্রষ্টব্য:',

    mockTest: 'CSCA Mock Test দিয়ে প্রস্তুতি নিন',

    mockTestText:
      'Mathematics, Physics এবং Chemistry-এর জন্য CSCA Mock Test দিয়ে অনুশীলন করুন।',

    startMock: 'Mock Test শুরু করুন',

    days: 'দিন',
    hours: 'ঘণ্টা',
    mins: 'মিনিট',
    secs: 'সেকেন্ড',

    completed: 'সম্পন্ন',
    upcoming: 'আসন্ন',

    subject: 'বিষয়',
    date: 'তারিখ',
  },
};

const months = ['November', 'December', 'January', 'March', 'April', 'June'];

function getMonthName(dateString: string, language: Language) {
  const date = new Date(`${dateString}T12:00:00+08:00`);

  return new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
    month: 'long',
  }).format(date);
}

function formatDate(dateString: string, language: Language) {
  const date = new Date(`${dateString}T12:00:00+08:00`);

  return new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatShortDate(dateString: string, language: Language) {
  const date = new Date(`${dateString}T12:00:00+08:00`);

  return new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

function getBeijingDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00+08:00`);
}

function getDhakaTime(date: string, time: string) {
  const beijingDate = getBeijingDateTime(date, time);

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(beijingDate);
}

function calculateTimeLeft(target: Date): TimeLeft {
  const difference = target.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),

    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),

    minutes: Math.floor((difference / (1000 * 60)) % 60),

    seconds: Math.floor((difference / 1000) % 60),
  };
}

function padNumber(value: number) {
  return value.toString().padStart(2, '0');
}

export default function Schedule() {
  const [language, setLanguage] = useState<Language>('en');
  const [now, setNow] = useState(() => new Date());

  const t = translations[language];

  const sessions = scheduleData.sessions as Session[];

  /*
   * Find the next upcoming examination automatically.
   */
  const nextExam = useMemo(() => {
    const upcoming = sessions
      .map(session => ({
        ...session,

        startDate: getBeijingDateTime(session.date, session.startTime),

        endDate: getBeijingDateTime(session.date, session.endTime),
      }))

      .filter(session => session.startDate.getTime() > now.getTime())

      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return upcoming[0] ?? null;
  }, [sessions, now]);

  /*
   * Countdown.
   */
  const timeLeft = useMemo(() => {
    if (!nextExam) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return calculateTimeLeft(nextExam.startDate);
  }, [nextExam, now]);

  /*
   * Update every second.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /*
   * Group sessions month-wise.
   */
  const groupedSessions = useMemo(() => {
    const groups: Record<string, Session[]> = {};

    sessions.forEach(session => {
      const month = getMonthName(session.date, 'en');

      if (!groups[month]) {
        groups[month] = [];
      }

      groups[month].push(session);
    });

    return months
      .filter(month => groups[month])
      .map(month => ({
        month,
        sessions: groups[month],
      }));
  }, [sessions]);

  return (
    <main className="schedule-page">
      {/* =====================================================
          NOTE
          Appears directly below the fixed navbar
          ===================================================== */}

      <section className="schedule-notice">
        <div className="schedule-container">
          <div className="schedule-notice-inner">
            <strong className="schedule-notice-label">{t.notice}</strong>

            <p>{scheduleData.notice[language]}</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="schedule-hero">
        <div className="schedule-container">
          <div className="schedule-hero-content">
            <div className="schedule-badge">
              <span className="schedule-badge-dot" />
              {t.badge}
            </div>

            <h1>{t.title}</h1>

            <p>{t.subtitle}</p>

            <div className="schedule-language-switcher">
              <button
                type="button"
                className={language === 'en' ? 'active' : ''}
                onClick={() => setLanguage('en')}
              >
                English
              </button>

              <button
                type="button"
                className={language === 'bn' ? 'active' : ''}
                onClick={() => setLanguage('bn')}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEXT EXAM
          ===================================================== */}

      {nextExam && (
        <section className="next-exam-section">
          <div className="schedule-container">
            <div className="next-exam-card">
              <div className="next-exam-top">
                <div>
                  <span className="next-exam-label">{t.nextExam}</span>

                  <h2>{nextExam.subject}</h2>

                  <p className="next-exam-date">
                    {formatDate(nextExam.date, language)}
                  </p>
                </div>

                <div className="next-exam-duration">
                  <span>{t.duration}</span>

                  <strong>{nextExam.durationMinutes}</strong>

                  <small>{t.minutes}</small>
                </div>
              </div>

              {/* Countdown */}

              <div className="countdown-wrapper">
                <div className="countdown-heading">{t.startsIn}</div>

                <div className="countdown-grid">
                  <div className="countdown-box">
                    <strong>{padNumber(timeLeft.days)}</strong>

                    <span>{t.days}</span>
                  </div>

                  <div className="countdown-separator">:</div>

                  <div className="countdown-box">
                    <strong>{padNumber(timeLeft.hours)}</strong>

                    <span>{t.hours}</span>
                  </div>

                  <div className="countdown-separator">:</div>

                  <div className="countdown-box">
                    <strong>{padNumber(timeLeft.minutes)}</strong>

                    <span>{t.mins}</span>
                  </div>

                  <div className="countdown-separator">:</div>

                  <div className="countdown-box">
                    <strong>{padNumber(timeLeft.seconds)}</strong>

                    <span>{t.secs}</span>
                  </div>
                </div>
              </div>

              {/* Time comparison */}

              <div className="time-comparison">
                <div className="time-card">
                  <div className="time-card-icon">🇨🇳</div>

                  <div>
                    <span>{t.beijing}</span>

                    <strong>
                      {nextExam.startTime} – {nextExam.endTime}
                    </strong>

                    <small>{t.officialTime} · UTC+8</small>
                  </div>
                </div>

                <div className="time-card">
                  <div className="time-card-icon">🇧🇩</div>

                  <div>
                    <span>{t.dhaka}</span>

                    <strong>
                      {getDhakaTime(nextExam.date, nextExam.startTime)} –{' '}
                      {getDhakaTime(nextExam.date, nextExam.endTime)}
                    </strong>

                    <small>{t.localTime} · UTC+6</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FULL SCHEDULE
          ===================================================== */}

      <section className="full-schedule-section">
        <div className="schedule-container">
          <div className="section-heading">
            <span>{t.badge}</span>

            <h2>{t.schedule}</h2>

            <p>{t.scheduleSubtitle}</p>
          </div>

          <div className="schedule-months">
            {groupedSessions.map(({ month, sessions: monthSessions }) => (
              <section className="month-card" key={month}>
                <div className="month-card-header">
                  <div>
                    <span>{scheduleData.yearRange}</span>

                    <h3>
                      {language === 'bn'
                        ? getMonthName(monthSessions[0].date, 'bn')
                        : month}
                    </h3>
                  </div>

                  <div className="month-count">{monthSessions.length}</div>
                </div>

                {/* Desktop table */}

                <div className="schedule-table-wrapper">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>{t.subject}</th>
                        <th>{t.date}</th>
                        <th>{t.beijing}</th>
                        <th>{t.dhaka}</th>
                        <th>{t.duration}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {monthSessions.map(session => {
                        const startDate = getBeijingDateTime(
                          session.date,
                          session.startTime,
                        );

                        const isPast = startDate.getTime() <= now.getTime();

                        return (
                          <tr
                            key={session.id}
                            className={isPast ? 'past-session' : ''}
                          >
                            <td>
                              <div className="subject-cell">
                                <span className="subject-dot" />

                                <strong>{session.subject}</strong>
                              </div>
                            </td>

                            <td>
                              <div className="date-cell">
                                <strong>
                                  {formatShortDate(session.date, language)}
                                </strong>

                                <small>
                                  {
                                    formatDate(session.date, language).split(
                                      ',',
                                    )[0]
                                  }
                                </small>
                              </div>
                            </td>

                            <td>
                              <div className="table-time">
                                <strong>{session.startTime}</strong>

                                <span>– {session.endTime}</span>

                                <small>UTC+8</small>
                              </div>
                            </td>

                            <td>
                              <div className="table-time dhaka-time">
                                <strong>
                                  {getDhakaTime(
                                    session.date,
                                    session.startTime,
                                  )}
                                </strong>

                                <span>
                                  –{' '}
                                  {getDhakaTime(session.date, session.endTime)}
                                </span>

                                <small>UTC+6</small>
                              </div>
                            </td>

                            <td>
                              <span className="duration-badge">
                                {session.durationMinutes} {t.minutes}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}

                <div className="mobile-schedule-list">
                  {monthSessions.map(session => {
                    const startDate = getBeijingDateTime(
                      session.date,
                      session.startTime,
                    );

                    const isPast = startDate.getTime() <= now.getTime();

                    return (
                      <article
                        className={`mobile-session-card ${
                          isPast ? 'past-session' : ''
                        }`}
                        key={session.id}
                      >
                        <div className="mobile-session-top">
                          <div>
                            <span className="mobile-subject">
                              {session.subject}
                            </span>

                            <strong>
                              {formatDate(session.date, language)}
                            </strong>
                          </div>

                          <span className="duration-badge">
                            {session.durationMinutes} {t.minutes}
                          </span>
                        </div>

                        <div className="mobile-time-grid">
                          <div>
                            <span>🇨🇳 {t.beijing}</span>

                            <strong>
                              {session.startTime} – {session.endTime}
                            </strong>
                          </div>

                          <div>
                            <span>🇧🇩 {t.dhaka}</span>

                            <strong>
                              {getDhakaTime(session.date, session.startTime)} –{' '}
                              {getDhakaTime(session.date, session.endTime)}
                            </strong>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          IMPORTANT INFORMATION
          ===================================================== */}

      <section className="important-section">
        <div className="schedule-container">
          <div className="section-heading">
            <span>{t.important}</span>

            <h2>{t.important}</h2>
          </div>

          <div className="important-grid">
            <div className="important-card">
              <div className="important-icon">🇨🇳</div>

              <h3>{t.beijing}</h3>

              <p>{t.timezoneInfo}</p>
            </div>

            <div className="important-card">
              <div className="important-icon">🇧🇩</div>

              <h3>{t.dhaka}</h3>

              <p>{t.localInfo}</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOCK TEST CTA
          ===================================================== */}

      <section className="schedule-cta">
        <div className="schedule-container">
          <div className="schedule-cta-inner">
            <div>
              <span>{t.badge}</span>

              <h2>{t.mockTest}</h2>

              <p>{t.mockTestText}</p>
            </div>

            <Link href="/mock-test" className="schedule-cta-button">
              {t.startMock}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
