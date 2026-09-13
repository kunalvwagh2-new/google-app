import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Trash2, UserX } from 'lucide-react';
import { User, Post } from '../types.ts';
import { Button } from './ui/Button.tsx';
import { Avatar } from './ui/Avatar.tsx';

interface AdminPanelProps {
  users: User[];
  posts: Post[];
  onDeletePost: (postId: string) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  posts,
  onDeletePost,
  onToggleUserStatus,
}) => {
  const [selectedSection, setSelectedSection] = React.useState<'reports' | 'users' | 'metrics'>('reports');

  const simulatedReports = [
    {
      id: 'rep_1',
      targetType: 'POST',
      targetId: 'post_1',
      reason: 'Spam / Phishing Link',
      reporterName: 'David Kim (Moderator)',
      status: 'OPEN',
      summary: 'Automated referral link reported by 2 community members.',
    },
    {
      id: 'rep_2',
      targetType: 'USER',
      targetId: 'usr_bot',
      reason: 'Inauthentic Activity / Bot',
      reporterName: 'Sarah Chen',
      status: 'OPEN',
      summary: 'High-frequency mass friend request behavior detected.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Moderation & Safety Dashboard
              </h2>
              <p className="text-xs text-zinc-400">
                Role-Based Access Control: Community guidelines enforcement
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setSelectedSection('reports')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedSection === 'reports'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Reports Queue
            </button>
            <button
              onClick={() => setSelectedSection('users')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedSection === 'users'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Account Controls
            </button>
          </div>
        </div>
      </div>

      {/* Reports Queue */}
      {selectedSection === 'reports' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Pending Flagged Content ({simulatedReports.length})
          </h3>

          <div className="space-y-3">
            {simulatedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                      {report.reason}
                    </span>
                    <span className="text-xs text-zinc-400">Reported by {report.reporterName}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    {report.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {report.targetType === 'POST' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDeletePost(report.targetId)}
                      className="text-xs h-8"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Take Down Post
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" className="text-xs h-8">
                    <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Status Management */}
      {selectedSection === 'users' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            Registered Community Members ({users.length})
          </h3>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {users.map((user) => (
              <div key={user.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.profile.avatarUrl}
                    name={user.profile.displayName}
                    size="md"
                    statusIndicator={user.status === 'ACTIVE' ? 'online' : 'offline'}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {user.profile.displayName}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-500">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400">@{user.username} • {user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {user.status}
                  </span>
                  <Button
                    size="sm"
                    variant={user.status === 'ACTIVE' ? 'outline' : 'primary'}
                    onClick={() => onToggleUserStatus(user.id)}
                    className="text-xs h-7 px-2.5"
                  >
                    <UserX className="w-3 h-3 mr-1" />
                    {user.status === 'ACTIVE' ? 'Suspend' : 'Reinstate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
