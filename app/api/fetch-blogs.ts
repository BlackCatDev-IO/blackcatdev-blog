import { BlogPostData } from '../post/types/blog';

const apiUrl = 'https://blackcatdev-blog-payload.vercel.app/api/posts';
const baseUrl = 'https://blackcatdev-blog-payload.vercel.app';

/**
 * Transform the new content structure to match the expected format
 */
function transformContent(content: any): any[] {
  if (!content || !content.root) return [];

  return content.root.children.map((block: any) => {
    // Handle headings
    if (block.type === 'heading') {
      return {
        type: 'heading',
        level: parseInt(block.tag?.substring(1)) || 2,
        children: block.children.map((child: any) => ({
          text: child.text,
          bold: child.format === 1,
        })),
      };
    }

    // Handle paragraphs
    if (block.type === 'paragraph') {
      return {
        type: 'paragraph',
        children: block.children.map((child: any) => ({
          text: child.text,
          bold: child.format === 1,
          italic: child.format === 2,
          underline: false,
          strikethrough: false,
          type: child.type,
        })),
      };
    }

    // Handle image blocks
    if (block.type === 'image') {
      // Ensure image URLs are properly formed with the base URL
      const imageUrl =
        block.src && block.src.startsWith('/')
          ? `${baseUrl}${block.src}`
          : block.src;

      return {
        type: 'image',
        image: {
          data: {
            attributes: {
              url: imageUrl,
              alternativeText: block.alt || '',
              caption: block.caption || null,
              width: block.width || 800,
              height: block.height || 600,
            },
          },
        },
        children: [{ text: '' }],
      };
    }

    // Default case
    return {
      type: block.type || 'paragraph',
      children: block.children?.map((child: any) => ({
        text: child.text || '',
      })) || [{ text: '' }],
    };
  });
}

export async function getBlogPosts(): Promise<BlogPostData[]> {
  try {
    const res = await fetch(apiUrl, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error('Failed to get blog posts');
    }

    const json = await res.json();
    return json.docs as BlogPostData[];
  } catch (error) {
    console.error(error);
    throw new Error('Error on request');
  }
}

export async function getBlogPostsById({
  slug: slug,
}: {
  slug: string;
}): Promise<BlogPostData> {
  try {
    // First fetch all posts
    const res = await fetch(apiUrl, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error('Failed to get blog posts');
    }

    const json = await res.json();
    const posts = json.docs;

    // Find the post with the matching slug
    const post = posts.find((p: any) => p.slug === slug);

    if (!post) {
      throw new Error(`Blog post with slug ${slug} not found`);
    }

    return post as BlogPostData;
  } catch (error) {
    console.error(error);
    throw new Error('Error on request');
  }
}
