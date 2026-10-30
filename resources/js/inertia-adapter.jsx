import React, { useState, useEffect } from 'react';

/**
 * Inertia.js Adapter & Compatibility Layer for Shaw Enterprise
 * Allows all existing Inertia React components to run seamlessly in standard React / Vite.
 */

export function Link({ href = '/', children, className = '', onClick, ...props }) {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      e.preventDefault();
      if (window.__navigate) {
        window.__navigate(href);
      } else {
        window.location.pathname = href;
      }
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function Head({ title, children }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return <>{children}</>;
}

export const router = {
  get: (url, params = {}, options = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, val);
      }
    });
    const queryString = searchParams.toString();
    const targetUrl = queryString ? `${url}?${queryString}` : url;
    
    if (window.__navigate) {
      window.__navigate(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  },
  post: (url, data = {}, options = {}) => {
    console.log('[Inertia POST to', url, ']:', data);
    if (window.__addInquiry) {
      window.__addInquiry(data);
    }
    if (options.onSuccess) {
      options.onSuccess();
    }
  },
  visit: (url) => {
    if (window.__navigate) {
      window.__navigate(url);
    } else {
      window.location.href = url;
    }
  },
};

export function useForm(initialValues = {}) {
  const [data, setDataState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const setData = (keyOrFn, maybeValue) => {
    if (typeof keyOrFn === 'function') {
      setDataState(keyOrFn);
    } else if (typeof keyOrFn === 'string') {
      setDataState((prev) => ({ ...prev, [keyOrFn]: maybeValue }));
    } else if (typeof keyOrFn === 'object') {
      setDataState((prev) => ({ ...prev, ...keyOrFn }));
    }
  };

  const reset = (...fields) => {
    if (fields.length === 0) {
      setDataState(initialValues);
    } else {
      setDataState((prev) => {
        const next = { ...prev };
        fields.forEach((f) => (next[f] = initialValues[f]));
        return next;
      });
    }
  };

  const post = (url, options = {}) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setRecentlySuccessful(true);

      if (window.__addInquiry) {
        window.__addInquiry(data);
      }

      if (options.onSuccess) {
        options.onSuccess();
      }

      setTimeout(() => {
        setRecentlySuccessful(false);
      }, 4000);
    }, 500);
  };

  return {
    data,
    setData,
    post,
    processing,
    errors,
    reset,
    recentlySuccessful,
  };
}

export function usePage() {
  return {
    props: {
      auth: { user: null },
      errors: {},
    },
  };
}

export default {
  Link,
  Head,
  router,
  useForm,
  usePage,
};
