// src/pages/dashboard/hooks/useBlockedIps.js
import { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';

const useBlockedIps = () => {
  const { useBlockedIps } = useDashboard();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('active');
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
  }, [filter]);

  const query = useBlockedIps(page, {
    ip: debouncedSearch,
    active_only: filter === 'active',
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
    filter,
    setFilter,
  };
};

export default useBlockedIps;