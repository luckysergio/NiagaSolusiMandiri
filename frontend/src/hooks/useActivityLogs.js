import { useState, useEffect, useMemo } from 'react';
import { useDashboard } from './useDashboard';

const useActivityLogs = () => {
  const { useActivityLogs } = useDashboard();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [module, dateFrom, dateTo]);

  const query = useActivityLogs(page, {
    module,
    action: debouncedSearch,
    date_from: dateFrom,
    date_to: dateTo,
  });

  const data = useMemo(() => query.data?.data?.data || [], [query.data]);
  const pagination = useMemo(() => query.data?.data?.meta || {}, [query.data]);

  const resetDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  return {
    ...query,
    data,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    module,
    setModule,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    resetDateFilter,
  };
};

export default useActivityLogs;