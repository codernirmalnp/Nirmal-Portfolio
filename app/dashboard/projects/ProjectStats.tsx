import React from 'react';

interface ProjectStatsProps {
  total: number;
  active: number;
  completed: number;
  archived: number;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ total, active, completed, archived }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="bg-darkBg p-4 rounded-lg border border-white/10">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-themeGradient rounded-md flex items-center justify-center mr-3">
          <i className="bi bi-briefcase text-white"></i>
        </div>
        <div>
          <p className="text-sm font-outfit font-medium text-white/70">Total Projects</p>
          <p className="text-lg font-outfit font-medium text-white">{total}</p>
        </div>
      </div>
    </div>
    <div className="bg-darkBg p-4 rounded-lg border border-white/10">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-green-500/20 rounded-md flex items-center justify-center mr-3">
          <i className="bi bi-check-circle text-green-400"></i>
        </div>
        <div>
          <p className="text-sm font-outfit font-medium text-white/70">Active</p>
          <p className="text-lg font-outfit font-medium text-white">{active}</p>
        </div>
      </div>
    </div>
    <div className="bg-darkBg p-4 rounded-lg border border-white/10">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-500/20 rounded-md flex items-center justify-center mr-3">
          <i className="bi bi-flag text-blue-400"></i>
        </div>
        <div>
          <p className="text-sm font-outfit font-medium text-white/70">Completed</p>
          <p className="text-lg font-outfit font-medium text-white">{completed}</p>
        </div>
      </div>
    </div>
    <div className="bg-darkBg p-4 rounded-lg border border-white/10">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-500/20 rounded-md flex items-center justify-center mr-3">
          <i className="bi bi-archive text-gray-400"></i>
        </div>
        <div>
          <p className="text-sm font-outfit font-medium text-white/70">Archived</p>
          <p className="text-lg font-outfit font-medium text-white">{archived}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ProjectStats; 