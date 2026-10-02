import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'easycsca',
  description: 'CSCA Exam Preparation Platform',
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-language="en">
      <head>
        {/* =================================================
            INITIAL LANGUAGE
        ================================================= */}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var language =
                    localStorage.getItem('easycsca-language') || 'en';

                  if (language !== 'en' && language !== 'bn') {
                    language = 'en';
                  }

                  document.documentElement.setAttribute(
                    'data-language',
                    language
                  );

                  document.documentElement.setAttribute(
                    'lang',
                    language
                  );
                } catch (error) {
                  document.documentElement.setAttribute(
                    'data-language',
                    'en'
                  );

                  document.documentElement.setAttribute(
                    'lang',
                    'en'
                  );
                }
              })();
            `,
          }}
        />
      </head>

      <body>
        {/* =================================================
            NAVBAR
        ================================================= */}

        <header className="navbar">
          <nav className="navbar-container">
            {/* MOBILE MENU */}

            <input
              type="checkbox"
              id="mobile-menu-toggle"
              className="mobile-menu-toggle"
            />

            <label
              htmlFor="mobile-menu-toggle"
              className="mobile-menu-button"
              aria-label="Toggle navigation menu"
            >
              <span />
              <span />
              <span />
            </label>

            {/* LOGO */}

            <Link href="/" className="navbar-logo">
              easycsca
            </Link>

            {/* DESKTOP NAVIGATION */}

            <div className="desktop-navigation">
              <Link href="/">
                <span className="lang-en">Home</span>
                <span className="lang-bn">হোম</span>
              </Link>

              <Link href="/about">
                <span className="lang-en">About EasyCSCA</span>
                <span className="lang-bn">EasyCSCA সম্পর্কে</span>
              </Link>

              <Link href="/schedule">
                <span className="lang-en">Schedule</span>
                <span className="lang-bn">সময়সূচি</span>
              </Link>

              {/* LANGUAGE */}

              <div
                className="navbar-language-switcher"
                aria-label="Language switcher"
              >
                <button
                  type="button"
                  className="language-button active"
                  data-set-language="en"
                  aria-label="Switch to English"
                >
                  EN
                </button>

                <button
                  type="button"
                  className="language-button"
                  data-set-language="bn"
                  aria-label="বাংলায় পরিবর্তন করুন"
                >
                  বাংলা
                </button>
              </div>

              {/* MOCK TEST */}

              <Link href="/mock-test" className="desktop-mock-test-button">
                <span className="lang-en">CSCA Mock Test</span>
                <span className="lang-bn">CSCA Mock Test</span>
              </Link>
            </div>

            {/* MOBILE MOCK TEST */}

            <Link href="/mock-test" className="mobile-mock-test-button">
              <span className="lang-en">CSCA Mock Test</span>
              <span className="lang-bn">CSCA Mock Test</span>
            </Link>
          </nav>

          {/* MOBILE NAVIGATION */}

          <div className="mobile-navigation">
            <Link href="/">
              <span className="lang-en">Home</span>
              <span className="lang-bn">হোম</span>
            </Link>

            <Link href="/about">
              <span className="lang-en">About EasyCSCA</span>
              <span className="lang-bn">EasyCSCA সম্পর্কে</span>
            </Link>

            <Link href="/schedule">
              <span className="lang-en">Schedule</span>
              <span className="lang-bn">সময়সূচি</span>
            </Link>

            <div className="mobile-language-switcher">
              <button
                type="button"
                className="language-button active"
                data-set-language="en"
                aria-label="Switch to English"
              >
                EN
              </button>

              <button
                type="button"
                className="language-button"
                data-set-language="bn"
                aria-label="বাংলায় পরিবর্তন করুন"
              >
                বাংলা
              </button>
            </div>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main>{children}</main>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="footer">
          <div className="footer-container">
            {/* BRAND */}

            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                easycsca
              </Link>

              <p>
                <span className="lang-en">CSCA Exam Preparation Platform</span>

                <span className="lang-bn">
                  CSCA পরীক্ষার প্রস্তুতি প্ল্যাটফর্ম
                </span>
              </p>
            </div>

            {/* LINKS */}

            <div className="footer-links-wrapper">
              <div className="footer-link-column">
                <h3>
                  <span className="lang-en">Company</span>
                  <span className="lang-bn">আমাদের সম্পর্কে</span>
                </h3>

                <Link href="/about">
                  <span className="lang-en">About</span>
                  <span className="lang-bn">আমাদের সম্পর্কে</span>
                </Link>

                <label
                  htmlFor="contact-popup-toggle"
                  className="footer-text-link"
                  role="button"
                  tabIndex={0}
                >
                  <span className="lang-en">Contact Us</span>
                  <span className="lang-bn">যোগাযোগ</span>
                </label>
              </div>

              {/* LEGAL */}

              <div className="footer-link-column">
                <h3>
                  <span className="lang-en">Legal</span>
                  <span className="lang-bn">আইনি তথ্য</span>
                </h3>

                <Link href="/privacy-policy">
                  <span className="lang-en">Privacy Policy</span>

                  <span className="lang-bn">গোপনীয়তা নীতি</span>
                </Link>

                <Link href="/terms-and-conditions">
                  <span className="lang-en">Terms & Conditions</span>

                  <span className="lang-bn">শর্তাবলি</span>
                </Link>

                <Link href="/disclaimer">
                  <span className="lang-en">Disclaimer</span>

                  <span className="lang-bn">দাবিত্যাগ</span>
                </Link>

                <Link href="/cookie-policy">
                  <span className="lang-en">Cookie Policy</span>

                  <span className="lang-bn">কুকি নীতি</span>
                </Link>
              </div>
            </div>

            {/* CONTACT */}

            <div className="footer-contact">
              <span className="footer-contact-label">
                <span className="lang-en">CONTACT</span>
                <span className="lang-bn">যোগাযোগ</span>
              </span>

              <h3>
                <span className="lang-en">Have something to tell us?</span>

                <span className="lang-bn">আমাদের কিছু বলতে চাও?</span>
              </h3>

              <p>
                <span className="lang-en">
                  Questions, suggestions, feedback or anything else? Send us a
                  message.
                </span>

                <span className="lang-bn">
                  কোনো প্রশ্ন, পরামর্শ বা মতামত থাকলে আমাদের একটি বার্তা পাঠাও।
                </span>
              </p>

              {/* =================================================
                  POPUP TOGGLE
              ================================================= */}

              <input
                type="checkbox"
                id="contact-popup-toggle"
                className="contact-popup-toggle"
              />

              {/* =================================================
                  OPEN CONTACT POPUP
              ================================================= */}

              <label
                htmlFor="contact-popup-toggle"
                className="footer-contact-button"
              >
                <span className="lang-en">Send a Message</span>

                <span className="lang-bn">বার্তা পাঠাও</span>

                <span className="footer-contact-arrow" aria-hidden="true">
                  →
                </span>
              </label>

              {/* =================================================
                  CONTACT MODAL
              ================================================= */}

              <div className="contact-modal-overlay">
                {/* BACKDROP */}

                <label
                  htmlFor="contact-popup-toggle"
                  className="contact-modal-backdrop"
                  aria-label="Close contact form"
                />

                {/* =================================================
                    MODAL
                ================================================= */}

                <div
                  className="contact-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="contact-modal-title"
                >
                  {/* =================================================
                      TOP RIGHT CLOSE BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    className="contact-modal-close"
                    id="contact-modal-close"
                    aria-label="Close contact form"
                  >
                    <span aria-hidden="true">×</span>
                  </button>

                  {/* =================================================
                      NORMAL CONTACT FORM
                  ================================================= */}

                  <div className="contact-form-view" id="contact-form-view">
                    <div className="contact-modal-header">
                      <span className="contact-modal-label">easycsca</span>

                      <h2 id="contact-modal-title">
                        <span className="lang-en">Send us a message</span>

                        <span className="lang-bn">
                          আমাদের একটি বার্তা পাঠাও
                        </span>
                      </h2>

                      <p>
                        <span className="lang-en">
                          Have a question, suggestion or something to tell us?
                          We&apos;d love to hear from you.
                        </span>

                        <span className="lang-bn">
                          কোনো প্রশ্ন, পরামর্শ বা কিছু বলার থাকলে আমাদের জানাও।
                        </span>
                      </p>
                    </div>

                    {/* =================================================
                        CONTACT FORM
                    ================================================= */}

                    <form className="contact-form">
                      {/* =================================================
                          IMPORTANT:
                          NO WEB3FORMS ACCESS KEY HERE.
                          The key is server-side only.
                      ================================================= */}

                      {/* SUBJECT */}

                      <input
                        type="hidden"
                        name="subject"
                        value="New Contact Message - easycsca"
                      />

                      {/* FROM NAME */}

                      <input
                        type="hidden"
                        name="from_name"
                        value="easycsca Website"
                      />

                      {/* NAME */}

                      <div className="contact-form-group">
                        <label htmlFor="contact-name">
                          <span className="lang-en">Your Name</span>

                          <span className="lang-bn">আপনার নাম</span>
                        </label>

                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          required
                          autoComplete="name"
                        />
                      </div>

                      {/* WHATSAPP */}

                      <div className="contact-form-group">
                        <label htmlFor="contact-whatsapp">
                          <span className="lang-en">WhatsApp Number</span>

                          <span className="lang-bn">WhatsApp নম্বর</span>
                        </label>

                        <input
                          id="contact-whatsapp"
                          type="tel"
                          name="whatsapp"
                          required
                          autoComplete="tel"
                          inputMode="tel"
                        />
                      </div>

                      {/* EMAIL */}

                      <div className="contact-form-group">
                        <label htmlFor="contact-email">
                          <span className="lang-en">Email Address</span>

                          <span className="lang-bn">ইমেইল ঠিকানা</span>
                        </label>

                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                        />
                      </div>

                      {/* MESSAGE */}

                      <div className="contact-form-group">
                        <label htmlFor="contact-message">
                          <span className="lang-en">Your Message</span>

                          <span className="lang-bn">আপনার বার্তা</span>
                        </label>

                        <textarea
                          id="contact-message"
                          name="message"
                          rows={5}
                          required
                          minLength={15}
                        />
                      </div>

                      {/* HONEYPOT */}

                      <input
                        type="checkbox"
                        name="botcheck"
                        className="hidden-botcheck"
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      {/* STATUS */}

                      <div
                        id="contact-form-status"
                        role="status"
                        aria-live="polite"
                        hidden
                      />

                      {/* SUBMIT */}

                      <button type="submit" className="contact-submit-button">
                        <span className="lang-en">Send Message</span>

                        <span className="lang-bn">বার্তা পাঠাও</span>

                        <span aria-hidden="true">→</span>
                      </button>
                    </form>
                  </div>

                  {/* =================================================
                      FULL SCREEN THANK YOU VIEW
                  ================================================= */}

                  <div
                    className="contact-thankyou-view"
                    id="contact-thankyou-view"
                    hidden
                    aria-live="polite"
                    aria-hidden="true"
                  >
                    <div className="contact-thankyou-content">
                      <div
                        className="contact-thankyou-check"
                        aria-hidden="true"
                      >
                        ✓
                      </div>

                      <span className="contact-thankyou-brand">easycsca</span>

                      <h2>
                        <span className="lang-en">
                          Thank you for contacting us!
                        </span>

                        <span className="lang-bn">
                          easycsca-এর সাথে যোগাযোগ করার জন্য ধন্যবাদ!
                        </span>
                      </h2>

                      <p>
                        <span className="lang-en">
                          Your message has been received successfully.
                        </span>

                        <span className="lang-bn">
                          আপনার বার্তাটি সফলভাবে গ্রহণ করা হয়েছে।
                        </span>
                      </p>

                      <p className="contact-thankyou-response">
                        <span className="lang-en">
                          We will get back to you within the next 12 hours.
                        </span>

                        <span className="lang-bn">
                          আগামী ১২ ঘণ্টার মধ্যে আমরা আপনার সাথে যোগাযোগ করব।
                        </span>
                      </p>

                      <div className="contact-thankyou-note">
                        <span className="lang-en">
                          Thank you for choosing easycsca.
                        </span>

                        <span className="lang-bn">
                          easycsca-এর সাথে থাকার জন্য ধন্যবাদ।
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER BOTTOM
          ================================================= */}

          <div className="footer-bottom">
            <div className="footer-bottom-inner">
              <p>
                © {new Date().getFullYear()} easycsca.{' '}
                <span className="lang-en">All rights reserved.</span>
                <span className="lang-bn">সর্বস্বত্ব সংরক্ষিত।</span>
              </p>
            </div>
          </div>
        </footer>

        {/* =================================================
            LANGUAGE SYSTEM
        ================================================= */}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {

                function updateLanguage(language) {

                  if (
                    language !== 'en' &&
                    language !== 'bn'
                  ) {
                    language = 'en';
                  }

                  document.documentElement.setAttribute(
                    'data-language',
                    language
                  );

                  document.documentElement.setAttribute(
                    'lang',
                    language
                  );

                  try {
                    localStorage.setItem(
                      'easycsca-language',
                      language
                    );
                  } catch (error) {}

                  var buttons =
                    document.querySelectorAll(
                      '[data-set-language]'
                    );

                  buttons.forEach(
                    function (button) {

                      var buttonLanguage =
                        button.getAttribute(
                          'data-set-language'
                        );

                      if (
                        buttonLanguage === language
                      ) {
                        button.classList.add('active');
                      } else {
                        button.classList.remove('active');
                      }
                    }
                  );
                }

                document.addEventListener(
                  'click',
                  function (event) {

                    var target =
                      event.target;

                    if (
                      !(target instanceof Element)
                    ) {
                      return;
                    }

                    var button =
                      target.closest(
                        '[data-set-language]'
                      );

                    if (!button) {
                      return;
                    }

                    var language =
                      button.getAttribute(
                        'data-set-language'
                      );

                    updateLanguage(language);
                  }
                );

                var savedLanguage = 'en';

                try {

                  var storedLanguage =
                    localStorage.getItem(
                      'easycsca-language'
                    );

                  if (
                    storedLanguage === 'en' ||
                    storedLanguage === 'bn'
                  ) {
                    savedLanguage =
                      storedLanguage;
                  }

                } catch (error) {}

                updateLanguage(savedLanguage);

              })();
            `,
          }}
        />

        {/* =================================================
            CONTACT FORM + POPUP SYSTEM
        ================================================= */}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {

                var form = null;
                var submitButton = null;
                var popupToggle = null;
                var closeButton = null;
                var formView = null;
                var thankYouView = null;

                var successTimer = null;

                /* =================================================
                   CLOSE POPUP
                ================================================= */

                function closeContactPopup() {

                  if (!popupToggle) {
                    return;
                  }

                  popupToggle.checked = false;

                  if (
                    window.history.state &&
                    window.history.state.easycscaContactPopup
                  ) {
                    window.history.back();
                  }
                }

                /* =================================================
                   OPEN POPUP
                ================================================= */

                function openContactPopup() {

                  if (!popupToggle) {
                    return;
                  }

                  if (
                    !(
                      window.history.state &&
                      window.history.state.easycscaContactPopup
                    )
                  ) {

                    window.history.pushState(
                      {
                        easycscaContactPopup: true
                      },
                      '',
                      window.location.href
                    );
                  }

                  popupToggle.checked = true;
                }

                /* =================================================
                   RESET FORM
                ================================================= */

                function resetContactForm() {

                  if (successTimer) {

                    window.clearTimeout(
                      successTimer
                    );

                    successTimer = null;
                  }

                  if (form) {
                    form.reset();
                  }

                  if (formView) {
                    formView.hidden = false;
                  }

                  if (thankYouView) {

                    thankYouView.hidden = true;

                    thankYouView.setAttribute(
                      'aria-hidden',
                      'true'
                    );
                  }

                  if (submitButton) {

                    submitButton.disabled = false;

                    var englishText =
                      submitButton.querySelector(
                        '.lang-en'
                      );

                    var banglaText =
                      submitButton.querySelector(
                        '.lang-bn'
                      );

                    var arrow =
                      submitButton.querySelector(
                        'span[aria-hidden="true"]'
                      );

                    if (englishText) {
                      englishText.textContent =
                        'Send Message';
                    }

                    if (banglaText) {
                      banglaText.textContent =
                        'বার্তা পাঠাও';
                    }

                    if (arrow) {
                      arrow.textContent = '→';
                    }
                  }
                }

                /* =================================================
                   SHOW THANK YOU
                ================================================= */

                function showThankYou() {

                  if (formView) {
                    formView.hidden = true;
                  }

                  if (thankYouView) {

                    thankYouView.hidden = false;

                    thankYouView.setAttribute(
                      'aria-hidden',
                      'false'
                    );
                  }

                  /*
                   Automatically close after 4 seconds.
                  */

                  successTimer =
                    window.setTimeout(
                      function () {

                        if (popupToggle) {

                          if (
                            window.history.state &&
                            window.history.state
                              .easycscaContactPopup
                          ) {

                            window.history.back();

                          } else {

                            popupToggle.checked =
                              false;

                            resetContactForm();
                          }
                        }

                        successTimer = null;

                      },
                      4000
                    );
                }

                /* =================================================
                   SETUP
                ================================================= */

                function setupForm() {

                  form =
                    document.querySelector(
                      '.contact-form'
                    );

                  submitButton =
                    document.querySelector(
                      '.contact-submit-button'
                    );

                  popupToggle =
                    document.getElementById(
                      'contact-popup-toggle'
                    );

                  closeButton =
                    document.getElementById(
                      'contact-modal-close'
                    );

                  formView =
                    document.getElementById(
                      'contact-form-view'
                    );

                  thankYouView =
                    document.getElementById(
                      'contact-thankyou-view'
                    );

                  if (
                    !form ||
                    !submitButton ||
                    !popupToggle ||
                    !formView ||
                    !thankYouView
                  ) {
                    return;
                  }

                  /* INITIAL STATE */

                  thankYouView.hidden = true;

                  /* =================================================
                     POPUP OPEN / CLOSE
                  ================================================= */

                  popupToggle.addEventListener(
                    'change',
                    function () {

                      if (
                        popupToggle.checked
                      ) {

                        openContactPopup();

                      } else {

                        if (
                          window.history.state &&
                          window.history.state
                            .easycscaContactPopup
                        ) {

                          window.history.back();
                        }

                        resetContactForm();
                      }
                    }
                  );

                  /* =================================================
                     CLOSE BUTTON
                  ================================================= */

                  if (closeButton) {

                    closeButton.addEventListener(
                      'click',
                      function () {

                        closeContactPopup();

                        resetContactForm();
                      }
                    );
                  }

                  /* =================================================
                     ESCAPE KEY
                  ================================================= */

                  document.addEventListener(
                    'keydown',
                    function (event) {

                      if (
                        event.key === 'Escape' &&
                        popupToggle.checked
                      ) {

                        event.preventDefault();

                        closeContactPopup();

                        resetContactForm();
                      }
                    }
                  );

                  /* =================================================
                     BACK BUTTON
                  ================================================= */

                  window.addEventListener(
                    'popstate',
                    function () {

                      if (popupToggle) {
                        popupToggle.checked = false;
                      }

                      resetContactForm();
                    }
                  );

                  /* =================================================
                     FORM SUBMIT
                  ================================================= */

                  form.addEventListener(
                    'submit',
                    async function (event) {

                      event.preventDefault();

                      /* Browser validation */

                      if (
                        !form.checkValidity()
                      ) {

                        form.reportValidity();

                        return;
                      }

                      /* =================================================
                         LOADING
                      ================================================= */

                      submitButton.disabled = true;

                      var englishText =
                        submitButton.querySelector(
                          '.lang-en'
                        );

                      var banglaText =
                        submitButton.querySelector(
                          '.lang-bn'
                        );

                      var arrow =
                        submitButton.querySelector(
                          'span[aria-hidden="true"]'
                        );

                      if (englishText) {
                        englishText.textContent =
                          'Sending...';
                      }

                      if (banglaText) {
                        banglaText.textContent =
                          'পাঠানো হচ্ছে...';
                      }

                      if (arrow) {
                        arrow.textContent = '...';
                      }

                      try {

                        var formData =
                          new FormData(form);

                        /* =================================================
                           SEND TO OUR NEXT.JS SERVER API

                           IMPORTANT:
                           The Web3Forms access key is NOT sent
                           from the browser.

                           The server route gets it from:
                           process.env.WEB3FORMS_ACCESS_KEY
                        ================================================= */

                        var response =
                          await fetch(
                            '/api/contact',
                            {
                              method: 'POST',

                              headers: {
                                'Accept':
                                  'application/json'
                              },

                              body: formData
                            }
                          );

                        /* =================================================
                           READ RESPONSE
                        ================================================= */

                        var result =
                          await response.json();

                        console.log(
                          'Contact API response:',
                          result
                        );

                        /* =================================================
                           SUCCESS
                        ================================================= */

                        if (
                          response.ok &&
                          result.success
                        ) {

                          form.reset();

                          if (englishText) {
                            englishText.textContent =
                              'Message Sent';
                          }

                          if (banglaText) {
                            banglaText.textContent =
                              'বার্তা পাঠানো হয়েছে';
                          }

                          if (arrow) {
                            arrow.textContent = '✓';
                          }

                          showThankYou();

                          return;
                        }

                        throw new Error(
                          result.message ||
                          'Unable to send your message.'
                        );

                      } catch (error) {

                        console.error(
                          'Contact form error:',
                          error
                        );

                        /* =================================================
                           RETURN TO NORMAL FORM
                        ================================================= */

                        formView.hidden = false;

                        thankYouView.hidden = true;

                        thankYouView.setAttribute(
                          'aria-hidden',
                          'true'
                        );

                        var language =
                          document.documentElement
                            .getAttribute(
                              'data-language'
                            ) || 'en';

                        /* Remove old error */

                        var oldError =
                          document.getElementById(
                            'contact-form-error'
                          );

                        if (oldError) {
                          oldError.remove();
                        }

                        /* =================================================
                           ERROR MESSAGE
                        ================================================= */

                        var errorBox =
                          document.createElement(
                            'div'
                          );

                        errorBox.id =
                          'contact-form-error';

                        errorBox.className =
                          'contact-form-error';

                        if (
                          language === 'bn'
                        ) {

                          errorBox.innerHTML =
                            '<strong>বার্তা পাঠানো যায়নি</strong>' +
                            '<span>দুঃখিত, কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।</span>';

                        } else {

                          errorBox.innerHTML =
                            '<strong>Message could not be sent</strong>' +
                            '<span>Something went wrong. Please try again in a moment.</span>';
                        }

                        form.insertBefore(
                          errorBox,
                          submitButton
                        );

                        /* =================================================
                           RESTORE BUTTON
                        ================================================= */

                        submitButton.disabled =
                          false;

                        if (englishText) {
                          englishText.textContent =
                            'Send Message';
                        }

                        if (banglaText) {
                          banglaText.textContent =
                            'বার্তা পাঠাও';
                        }

                        if (arrow) {
                          arrow.textContent =
                            '→';
                        }
                      }
                    }
                  );
                }

                /* =================================================
                   INITIALIZE
                ================================================= */

                if (
                  document.readyState ===
                  'loading'
                ) {

                  document.addEventListener(
                    'DOMContentLoaded',
                    setupForm
                  );

                } else {

                  setupForm();

                }

              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
