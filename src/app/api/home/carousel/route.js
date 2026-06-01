import { NextResponse } from "next/server";
import { getHomeCarouselSlides } from "@/lib/homeCarousel.server";

export const revalidate = 60;

export async function GET() {
  const slides = await getHomeCarouselSlides();
  return NextResponse.json({ slides });
}
