import { revalidatePath } from 'next/cache';

export async function POST(request) {
    try {
        const { path } = await request.json();

        if (path) {
            revalidatePath(path);
            return new Response(JSON.stringify({ revalidated: true, path }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Missing path to revalidate' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Error revalidating' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
