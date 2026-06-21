import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';

export default function NotFoundContent({ className }) {
  const [seconds, setSeconds] = useState(4);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="container margin-vert--xl">
      <div className="row">
        <div className="col col--8 col--offset-2 col--md--6 col--md--offset-3">
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'var(--ifm-card-background-color)',
            borderRadius: '12px',
            border: '1px solid rgba(48, 105, 152, 0.15)',
            boxShadow: '0 8px 32px rgba(48, 105, 152, 0.08)',
            backdropFilter: 'blur(10px)',
            marginTop: '2rem'
          }}>
            <div style={{
              fontSize: '6.5rem',
              fontWeight: 800,
              lineHeight: 1,
              background: 'linear-gradient(135deg, var(--py-blue-brand), var(--py-yellow-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontFamily: 'var(--ifm-font-family-monospace)',
              letterSpacing: '-2px'
            }}>
              404
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              color: 'var(--ifm-heading-color)',
              fontFamily: 'var(--ifm-font-family-monospace)',
              borderBottom: 'none',
              wordBreak: 'break-all',
              paddingBottom: 0
            }}>
              NameError: name '{currentPath || 'page'}' is not defined
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--ifm-text-color)',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              You have strayed beyond the logical boundary of planet Pythora. To prevent a memory leak or stack overflow, the system is executing an automatic garbage collection recovery:
            </p>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--ifm-color-primary)',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(48, 105, 152, 0.08)',
                border: '2px solid var(--ifm-color-primary)',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: '1.1rem',
                color: 'var(--ifm-color-primary)'
              }}>
                {seconds}
              </span>
              <span>seconds before returning to Saint Mountain OlymPyth...</span>
            </div>
            <div>
              <Link
                className="button button--primary button--lg"
                to="/"
                style={{
                  borderRadius: '8px',
                  padding: '0.8rem 2.2rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, var(--py-blue-brand), var(--ifm-color-primary-dark))',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(48, 105, 152, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                Compile Back to Safety
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

