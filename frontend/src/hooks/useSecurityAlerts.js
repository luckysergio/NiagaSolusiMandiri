// src/pages/dashboard/hooks/useSecurityAlerts.js
import { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';

const useSecurityAlerts = () => {
  const { useSecurityAlerts } = useDashboard();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [severity]);

  const query = useSecurityAlerts(page, {
    type: debouncedSearch,
    severity,
  });

  const data = useMemo(() => query.data?.data?.data || [], [query.data]);
  const pagination = useMemo(() => query.data?.data?.meta || {}, [query.data]);

  return {
    ...query,
    data,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    severity,
    setSeverity,
  };
};

export default useSecurityAlerts;