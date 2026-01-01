import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = async (req: NextRequest) => {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("refreshToken")?.value || "";
 
  if (url.pathname !== "/login" && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    } catch (err) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname === "/login" && token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/login"],
};
