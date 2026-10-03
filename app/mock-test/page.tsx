import Link from 'next/link';

export default function MockTestPage() {
  return (
    <main className="mock-test-page">
      {/* HERO */}
      <section className="mock-test-hero">
        <div className="mock-test-container">
          <div className="mock-test-hero-content">
            <div className="mock-test-badge">
              <span className="mock-test-badge-dot" />

              <span className="lang-en">CSCA MOCK TEST</span>
              <span className="lang-bn">CSCA মক টেস্ট</span>
            </div>

            <h1>
              <span className="lang-en">Practice. Improve. Perform.</span>

              <span className="lang-bn">
                অনুশীলন করো। উন্নতি করো। সাফল্য অর্জন করো।
              </span>
            </h1>

            <p>
              <span className="lang-en">
                Test your preparation and improve your exam speed.
              </span>

              <span className="lang-bn">
                নিজের প্রস্তুতি যাচাই করো এবং পরীক্ষার গতি বাড়াও।
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* NOTE */}
      <section className="mock-test-intro">
        <div className="mock-test-container">
          <div className="mock-test-note">
            <div className="mock-test-note-label">
              <span className="lang-en">Note</span>
              <span className="lang-bn">নোট</span>
            </div>

            <p>
              <span className="lang-en">
                So far, you already know that CSCA is not that difficult. It
                only feels difficult when you don't know it well. Now it's time
                to practice and test yourself.
              </span>

              <span className="lang-bn">
                এতক্ষণে তুমি বুঝে গেছো, CSCA আসলে তেমন কঠিন কিছু না। শুধু
                ভালোভাবে না জানার কারণে শুরুতে কঠিন মনে হয়। এবার practice করে
                নিজেকে test করার সময়।
              </span>
            </p>

            <p>
              <span className="lang-en">
                We have intentionally kept the mock test time{' '}
                <strong>50 minutes instead of 60 minutes</strong>. This extra
                pressure is designed to help you become faster and manage your
                time better.
              </span>

              <span className="lang-bn">
                আমরা ইচ্ছা করেই mock test-এর সময়{' '}
                <strong>৬০ মিনিটের বদলে ৫০ মিনিট</strong>
                রেখেছি। এই অতিরিক্ত চাপটা তোমাকে আরও দ্রুত কাজ করতে এবং সময়
                ভালোভাবে manage করতে সাহায্য করবে।
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ALL SUBJECT MOCK TESTS */}
      <section className="mock-test-practice">
        <div className="mock-test-container">
          <div className="mock-test-practice-heading">
            <span className="section-label">
              <span className="lang-en">Practice & Improve</span>
              <span className="lang-bn">Practice & Improve</span>
            </span>

            <h2>
              <span className="lang-en">All Subject Mock Tests</span>
              <span className="lang-bn">সকল বিষয়ের মক টেস্ট</span>
            </h2>

            <p>
              <span className="lang-en">
                Choose a subject and start your mock test.
              </span>

              <span className="lang-bn">
                একটি বিষয় নির্বাচন করে mock test শুরু করো।
              </span>
            </p>
          </div>

          {/* SUBJECT CARDS */}
          <div className="mock-test-grid">
            {/* MATHEMATICS */}
            <div className="mock-test-card">
              <div className="mock-test-card-label">
                <span className="lang-en">SUBJECT</span>
                <span className="lang-bn">বিষয়</span>
              </div>

              <h4>
                <span className="lang-en">Mathematics</span>
                <span className="lang-bn">গণিত</span>
              </h4>

              <p className="mock-test-card-description">
                <span className="lang-en">
                  Practice Mathematics with CSCA-style mock tests.
                </span>

                <span className="lang-bn">
                  CSCA-style Mathematics mock test দিয়ে practice করো।
                </span>
              </p>

              {/* DIRECT START */}
              <Link
                href="/mock-test/mathematics"
                className="mock-test-start-button"
              >
                <span className="lang-en">Mock Test →</span>
                <span className="lang-bn">মক টেস্ট →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
