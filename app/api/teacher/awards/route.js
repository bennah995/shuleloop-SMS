import { getAwardsData } from '../../../../lib/awards';

export async function GET(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'teacher' && role !== 'principal') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const term = searchParams.get('term');
    if (!classId || !term) {
      return Response.json({ error: 'classId and term are required' }, { status: 400 });
    }

    const data = await getAwardsData(classId, term);
    return Response.json(data);
  } catch (err) {
    console.error('Awards error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}