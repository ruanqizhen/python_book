import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';

export default function NotFoundContent({ className }) {
  const [seconds, setSeconds] = useState(2);

  useEffect(() => {
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
        <div className="col col--6 col--offset-3">
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'var(--ifm-card-background-color)',
            borderRadius: 'var(--border-radius-premium)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
            marginTop: '2rem'
          }}>
            <div style={{
              fontSize: '6rem',
              fontWeight: 800,
              lineHeight: 1,
              background: 'linear-gradient(135deg, var(--cyber-glow-purple), var(--cyber-glow-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontFamily: 'var(--ifm-heading-font-family)'
            }}>
              404
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              background: 'linear-gradient(to right, var(--ifm-heading-color) 60%, var(--cyber-glow-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--ifm-heading-font-family)',
              borderBottom: 'none'
            }}>
              您似乎在算力洪流中迷失了方向
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--ifm-text-color)',
              marginBottom: '2rem'
            }}>
              抱歉，您所访问的页面并不存在。我们将执行“自动熔断机制”：
            </p>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--ifm-color-primary)',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid var(--cyber-glow-purple)',
                fontSize: '1.1rem'
              }}>
                {seconds}
              </span>
              <span>秒后自动返回书籍首页...</span>
            </div>
            <div>
              <Link
                className="button button--primary button--lg"
                to="/"
                style={{
                  borderRadius: 'var(--border-radius-premium)',
                  padding: '0.8rem 2rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, var(--cyber-glow-purple), var(--cyber-glow-cyan))',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                立即返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
