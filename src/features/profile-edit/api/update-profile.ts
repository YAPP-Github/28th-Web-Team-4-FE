import type {
  ApiResponseUserProfileResponse,
  UpdateProfileRequest,
  UserProfileResponse,
} from '@/shared/api/generated/types.gen';
import { parseJsonResponse } from '@/shared/api/response';

export async function updateProfile(body: UpdateProfileRequest): Promise<UserProfileResponse> {
  const response = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const result = await parseJsonResponse<ApiResponseUserProfileResponse>(response);

  return result.data;
}
