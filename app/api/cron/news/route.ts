import { NextRequest, NextResponse } from 'next/server';
import { runNewsScraper } from '@/lib/scraper/service';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  // Check Bearer authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Check query parameter secret (useful for manual browser testing)
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');
  if (secretParam === cronSecret) {
    return true;
  }

  // If running in development environment, allow manual trigger
  if (
    process.env.NODE_ENV !== 'production' &&
    url.searchParams.get('manual') === 'true'
  ) {
    return true;
  }

  return false;
}

async function handleScraperRequest(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message:
          'Valid CRON_SECRET authorization header or ?secret= query parameter required.',
      },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const count = parseInt(url.searchParams.get('count') || '3', 10);
  const dryRun = url.searchParams.get('dryRun') === 'true';
  const force = url.searchParams.get('force') === 'true';

  try {
    const result = await runNewsScraper({
      limit: isNaN(count) ? 3 : Math.min(Math.max(count, 1), 10),
      dryRun,
      force,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API/cron/news] Execution failed:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          (error as Error).message ||
          'Internal server error occurred during scraper run.',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handleScraperRequest(request);
}

export async function POST(request: NextRequest) {
  return handleScraperRequest(request);
}
