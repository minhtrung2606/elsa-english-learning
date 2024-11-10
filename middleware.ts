import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secureApiRequests = async (req: NextRequest) => {
  const token = await getToken({
    req, secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 },
    );
  }
};

const getRequestSecurityInstruction = (req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith("/api/v1")) {
    return {
      shouldSecure: true,
      secure: secureApiRequests,
    };
  }
  return { shouldSecure: false, secure: () => {} };
};

export async function middleware(req: NextRequest) {
  const { shouldSecure, secure } = getRequestSecurityInstruction(req);
  if (shouldSecure) {
    return secure(req);
  }
  return NextResponse.next();
}
