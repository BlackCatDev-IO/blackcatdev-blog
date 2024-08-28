import { BlogPostData } from '../post/types/blog';

const baseUrl = process.env.baseUrl;

export async function getBlogPosts(): Promise<BlogPostData[]> {
  const url = `${baseUrl}/api/blog-posts/?populate=image`;

  try {
    const res = await fetch(url, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error('Failed to get blog posts');
    }

    const json = await res.json();

    return (await json.data) as BlogPostData[];
  } catch (error) {
    console.error(error);
    throw new Error('Error on request');
  }
}

export async function getBlogPostsById({
  id,
}: {
  id: string;
}): Promise<BlogPostData> {
  const url = `${baseUrl}/api/blog-posts/${id}?populate=image`;

  try {
    const res = await fetch(url, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error('Failed to get blog post');
    }

    const json = await res.json();

    return json.data as BlogPostData;
  } catch (error) {
    console.error(error);
    throw new Error('Error on request');
  }
}
