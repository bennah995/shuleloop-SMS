import { getActiveTerm } from '../../../../lib/active-term';

export async function GET() {
  try {
    const term = await getActiveTerm();
    return Response.json({ term: { id: term.id, name: `${term.name} ${term.year}` } });
  } catch (err) {
    if (err.statusCode === 409) {
      return Response.json({ term: null });
    }
    console.error('Active term fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}