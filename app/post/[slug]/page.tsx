import {
  getBlogPosts,
  getBlogPostsById as getBlogPostById,
} from '../../api/fetch-blogs';
import Image from 'next/image';
import React from 'react';
import styles from './blog-post.module.css';
import formatDate from '../../utils/date-formatter';

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const timestamp = Date.now();
  console.log('===========================================');
  console.log(
    '🔍 PAGE COMPONENT EXECUTING FOR SLUG:',
    params.slug,
    '- Time:',
    timestamp
  );
  console.log('===========================================');

  // Log this to stderr which is more likely to appear immediately
  console.error('DEBUG: Page component executing - check logs');

  const blog = await getBlogPostById({ slug: params.slug });

  const image = blog.heroImage;
  const baseUrl =
    process.env.baseUrl || 'https://blackcatdev-blog-payload.vercel.app';

  const imageUrl = image.url.startsWith('http')
    ? image.url
    : `${baseUrl}${image.url}`;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{blog.title}</h1>
      <p className={styles.publishedDate}>{blog.dateCreated}</p>
      <Image
        className={styles.mainImage}
        src={imageUrl}
        alt={image.filename}
        width={image.width}
        height={image.height}
      />
      <p className={styles.titleImageCaption}>{image.caption} </p>

      <RenderContent
        content={
          'root' in (blog.content || {})
            ? (blog.content as any).root?.children || []
            : Array.isArray(blog.content)
            ? blog.content
            : []
        }
      />
    </div>
  );
}

const RenderContent = ({ content }: { content: any }) => {
  if (!content || !Array.isArray(content)) {
    console.log('No content blocks to render or content is not an array');
    return null;
  }

  return content.map((block, index) => {
    if (!block) return null;

    console.log(`Processing block ${index}:`, block.type, block);

    switch (block.type) {
      case 'heading':
        const headingTag = block.tag || 'h3'; // Default to h3 if tag not specified
        return React.createElement(
          headingTag,
          { key: index, className: styles[headingTag] || '' },
          block.children?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.text}</span>
          ))
        );

      case 'paragraph':
        if (block.children.length === 0) {
          return null;
        }
        return (
          <p key={index} className={styles.paragraph}>
            {block.children?.map((child: any, childIndex: number) => {
              if (child.type === 'link' && child.fields?.url) {
                return (
                  <a
                    key={childIndex}
                    href={child.fields.url}
                    target={child.fields.newTab ? '_blank' : '_self'}
                    rel={child.fields.newTab ? 'noopener noreferrer' : ''}
                    className={styles.link}
                  >
                    {child.children?.map(
                      (linkChild: any, linkChildIndex: number) => (
                        <span key={linkChildIndex}>{linkChild.text}</span>
                      )
                    )}
                  </a>
                );
              }
              return (
                <span
                  key={childIndex}
                  className={`
                    ${child.format & 1 ? styles.bold : ''} 
                    ${child.format & 2 ? styles.italic : ''} 
                    ${child.format & 8 ? styles.underline : ''}
                  `}
                >
                  {child.text}
                </span>
              );
            })}
          </p>
        );

      case 'block':
        if (block.fields?.blockType === 'mediaBlock') {
          console.log('Found mediaBlock:', block);

          let imageData;
          let imageUrl = '';
          let imageAlt = '';
          let imageWidth = 800; // Default fallback width
          let imageHeight = 600; // Default fallback height
          let imageCaption = '';
          const baseUrl =
            process.env.baseUrl ||
            'https://blackcatdev-blog-payload.vercel.app';

          // Extract media data from the fields property
          if (block.fields?.media) {
            imageData = block.fields.media;

            imageUrl = imageData.url || imageData.thumbnailURL || '';

            imageAlt = imageData.alt || imageData.filename || '';
            imageWidth = imageData.width || 800;
            imageHeight = imageData.height || 600;
            imageCaption = imageData.caption || '';
          }

          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${baseUrl}${imageUrl}`;
          }

          return (
            <div key={index} className={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  className={styles.contentImage}
                  src={imageUrl}
                  alt={imageAlt}
                  width={imageWidth}
                  height={imageHeight}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  Image not available
                </div>
              )}
              {imageCaption && (
                <p className={styles.imageCaption}>{imageCaption}</p>
              )}
            </div>
          );
        }
        return null;

      case 'quote':
        return <blockquote key={index}>{block.children[0].text}</blockquote>;

      case 'code':
        return (
          <pre key={index}>
            <code>{block.children[0].text}</code>
          </pre>
        );

      default:
        return null;
    }
  });
};
