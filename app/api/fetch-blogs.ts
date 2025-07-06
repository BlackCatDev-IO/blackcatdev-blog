import { BlogPostData } from '../post/types/blog';

const apiUrl = 'https://blackcatdev-blog-payload.vercel.app/api/posts';
const baseUrl = 'https://blackcatdev-blog-payload.vercel.app';

/**
 * Transform the new CMS post format to match the expected BlogPostData structure
 */
function transformPostToCompatibleFormat(post: any): BlogPostData {
  // Use the actual heroImage from the API response if available
  const hasHeroImage = post.heroImage && post.heroImage.url;
  const imageUrl = hasHeroImage
    ? `${baseUrl}${post.heroImage.url}`
    : 'https://placehold.co/800x600/jpeg?text=' +
      encodeURIComponent(post.title);

  // Get image dimensions from heroImage or use defaults
  const width = hasHeroImage ? post.heroImage.width : 800;
  const height = hasHeroImage ? post.heroImage.height : 600;
  const mimeType = hasHeroImage ? post.heroImage.mimeType : 'image/jpeg';
  const fileName = hasHeroImage ? post.heroImage.filename : 'placeholder.jpg';

  const imageData = {
    id: 1,
    attributes: {
      name: fileName,
      alternativeText: post.title,
      caption: null,
      width: width,
      height: height,
      formats: {
        large: {
          ext: '.jpg',
          url: imageUrl,
          hash: '',
          mime: mimeType,
          name: '',
          path: null,
          size: 0,
          width: width,
          height: height,
          sizeInBytes: 0,
        },
        small: {
          ext: '.jpg',
          url: imageUrl,
          hash: '',
          mime: mimeType,
          name: '',
          path: null,
          size: 0,
          width: width,
          height: height,
          sizeInBytes: 0,
        },
        medium: {
          ext: '.jpg',
          url: imageUrl,
          hash: '',
          mime: mimeType,
          name: '',
          path: null,
          size: 0,
          width: width,
          height: height,
          sizeInBytes: 0,
        },
        thumbnail: {
          ext: '.jpg',
          url: imageUrl,
          hash: '',
          mime: mimeType,
          name: '',
          path: null,
          size: 0,
          width: width,
          height: height,
          sizeInBytes: 0,
        },
      },
      hash: '',
      ext: '.jpg',
      mime: mimeType,
      size: 0,
      url: imageUrl,
      previewUrl: null,
      provider: 'local',
      provider_metadata: null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    },
  };

  // Transform the content structure
  const transformedContent = transformContent(post.content);

  return {
    id: post.id || post._id,
    attributes: {
      title: post.title,
      subTitle: '',
      dateCreated: post.createdAt,
      content: transformedContent,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      image: {
        data: [imageData],
      },
      slug: post.slug,
    },
  };
}

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
    const posts = json.docs;

    return posts.map(transformPostToCompatibleFormat);
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

    return transformPostToCompatibleFormat(post);
  } catch (error) {
    console.error(error);
    throw new Error('Error on request');
  }
}
