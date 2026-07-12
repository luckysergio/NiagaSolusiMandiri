import { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';

const useActivityLogs = () => {
  const { useActivityLogs } = useDashboard();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('');
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
  }, [module]);

  const query = useActivityLogs(page, {
    module,
    action: debouncedSearch,
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
    module,
    setModule,
  };
};

export default useActivityLogs;