import type { DropdownOption } from '@/shared/ui/dropdown';
import type { UpdateProfileRequest, UserProfileResponse } from '@/shared/api/generated/types.gen';

export type ProfileOccupation = UpdateProfileRequest['occupation'];

export const PROFILE_OCCUPATION_OPTIONS = [
  { value: 'DEVELOPMENT', label: '개발' },
  { value: 'DESIGN', label: '디자인' },
  { value: 'MARKETING', label: '마케팅' },
  { value: 'PLANNING', label: '기획' },
  { value: 'SALES', label: '영업' },
  { value: 'DATA', label: '데이터' },
  { value: 'MANAGEMENT', label: '경영·관리' },
  { value: 'ETC', label: '기타' },
] satisfies readonly DropdownOption<ProfileOccupation>[];

export const PROFILE_OCCUPATION_LABELS: Record<UserProfileResponse['occupation'], string> = {
  DEVELOPMENT: '개발',
  DESIGN: '디자인',
  MARKETING: '마케팅',
  PLANNING: '기획',
  SALES: '영업',
  DATA: '데이터',
  MANAGEMENT: '경영·관리',
  ETC: '기타',
};
