import type { User } from '@/types/user';

export function getOtherParticipants(
  participantIds: string[],
  currentUserId: string,
  usersById: Map<string, User>
) {
  return participantIds
    .filter((id) => id !== currentUserId)
    .map((id) => usersById.get(id))
    .filter(Boolean) as User[];
}

export function buildChatTitle(otherParticipants: User[]) {
  if (otherParticipants.length === 0) return 'No participants';
  if (otherParticipants.length === 1) return otherParticipants[0].name;
  return `${otherParticipants[0].name} & ${otherParticipants.length - 1} other${
    otherParticipants.length > 2 ? 's' : ''
  }`;
}


