// app/api/principal/upload/route.js
//
// Authorizes direct-to-Blob uploads from the browser for admission
// documents (passport photo, KCPE certificate, leaving certificate).
// Living under /api/principal/* means proxy.js already enforces
// role === 'principal' by path prefix — no need to re-check the role
// header here (see 02-system-architecture.md, "Authorization").
//
// Requires: npm install @vercel/blob
// Requires: BLOB_READ_WRITE_TOKEN env var — set automatically once you
// connect a Blob store to the project in the Vercel dashboard; for local
// dev, pull it with `vercel env pull .env.local` or copy it in by hand.

import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Note: this callback is a webhook Vercel calls back to your
        // deployed app — it will NOT fire on localhost during `npm run dev`,
        // since Vercel can't reach your machine. The browser still gets the
        // blob URL back either way; only this server-side log line is
        // skipped locally. Nothing here is required for the upload to work.
        console.log('Admission document uploaded:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Upload authorization error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 400 });
  }
}