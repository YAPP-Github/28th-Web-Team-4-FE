import { z } from 'zod';

const PASSWORD_REQUIRED_MESSAGE = '비밀번호를 입력해 주세요.';
const PASSWORD_LENGTH_MESSAGE = '비밀번호는 8자 이상 64자 이하로 입력해 주세요.';
const PASSWORD_FORMAT_MESSAGE = '비밀번호는 영어, 숫자, 특수문자를 각각 1개 이상 포함해 주세요.';

export const signupPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, PASSWORD_REQUIRED_MESSAGE)
      .min(8, PASSWORD_LENGTH_MESSAGE)
      .max(64, PASSWORD_LENGTH_MESSAGE)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/, PASSWORD_FORMAT_MESSAGE),
    passwordConfirmation: z.string(),
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: '비밀번호가 일치하지 않아요.',
    path: ['passwordConfirmation'],
  });
