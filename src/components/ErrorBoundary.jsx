import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Keep production error details out of the browser console and user interface.
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-16">
        <section className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm" role="alert">
          <h1 className="text-2xl font-black text-slate-950">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-500">Please refresh the page and try again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-12 rounded-xl bg-rose-600 px-5 text-sm font-bold text-white hover:bg-rose-700"
          >
            Refresh page
          </button>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
