import React from 'react';

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-slate-500" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm max-w-md">{description}</p>
  </div>
);

export default EmptyState;