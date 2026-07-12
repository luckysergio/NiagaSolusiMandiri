// src/pages/dashboard/hooks/useLoginLogs.js
import { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';

const useLoginLogs = () => {
  const { useLoginLogs } = useDashboard();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
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
  }, [status]);

  const query = useLoginLogs(page, {
    email: debouncedSearch,
    status,
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
    status,
    setStatus,
  };
};

export default useLoginLogs;