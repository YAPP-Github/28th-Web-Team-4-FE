// route handler 규약상 async 시그니처 유지
// oxlint-disable-next-line typescript/require-await
export async function GET() {
  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
