import React from 'react';
import { Users, UserPlus, Check, X } from 'lucide-react';
import { User, Friendship } from '../types.ts';
import { Avatar } from './ui/Avatar.tsx';
import { Button } from './ui/Button.tsx';

interface FriendsPanelProps {
  currentUser: User;
  friends: User[];
  pendingRequests: Friendship[];
  suggestedUsers: User[];
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onSendRequest: (targetUserId: string) => void;
}

export const FriendsPanel: React.FC<FriendsPanelProps> = ({
  friends,
  pendingRequests,
  suggestedUsers,
  onAcceptRequest,
  onDeclineRequest,
  onSendRequest,
}) => {
  return (
    <div className="space-y-6">
      {/* Incoming Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Friend Requests ({pendingRequests.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={req.requester?.profile.avatarUrl}
                    name={req.requester?.profile.displayName || 'Requester'}
                    size="md"
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {req.requester?.profile.displayName}
                    </h5>
                    <p className="text-[10px] text-zinc-400">@{req.requester?.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAcceptRequest(req.id)}
                    className="h-8 px-2.5"
                    title="Confirm"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDeclineRequest(req.id)}
                    className="h-8 px-2.5 text-zinc-500"
                    title="Delete"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Friends List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Connected Friends ({friends.length})
            </h3>
          </div>
        </div>

        {friends.length === 0 ? (
          <p className="text-xs text-zinc-400 italic py-4 text-center">
            No friends connected yet. Connect with creators and peers below!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-800"
              >
                <Avatar
                  src={friend.profile.avatarUrl}
                  name={friend.profile.displayName}
                  size="md"
                  statusIndicator="online"
                />
                <div className="overflow-hidden">
                  <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {friend.profile.displayName}
                  </h5>
                  <p className="text-[10px] text-zinc-400 truncate">@{friend.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* People You May Know / Suggested Graph Connections */}
      {suggestedUsers.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-4">
            Suggested Connections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.profile.avatarUrl}
                    name={user.profile.displayName}
                    size="md"
                  />
                  <div className="max-w-[140px]">
                    <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {user.profile.displayName}
                    </h5>
                    <p className="text-[10px] text-zinc-400 truncate">{user.profile.bio || `@${user.username}`}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendRequest(user.id)}
                  className="text-xs text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
