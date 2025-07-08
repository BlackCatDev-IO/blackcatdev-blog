interface ContentChild {
  text?: string;
  type?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  url?: string;
  children?: ContentChild[];
}

export interface ContentBlock {
  type: string;
  level?: number;
  format?: string;
  children: ContentChild[];
  image?: ImageDetails;
  listType?: 'bullet' | 'number';
  start?: number;
  tag?: string;
  value?: number;
  fields?: {
    media?: {
      id?: string;
      url?: string;
      alt?: string;
      width?: number;
      height?: number;
      caption?: string;
      thumbnailURL?: string;
      alternativeText?: string;
      filename?: string;
    };
    blockType?: string;
    blockName?: string;
  };

  media?: {
    id?: string;
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    thumbnailURL?: string;
    alternativeText?: string;
    filename?: string;
  };
  version?: number;
}

export interface PayloadContent {
  root?: {
    children: ContentBlock[];
    direction?: string;
    format?: string;
    indent?: number;
    type?: string;
    version?: number;
  };
}

interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

interface ImageDetails {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  size: number;
  width: number;
  height: number;
  caption: string | null;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  provider: string;
  createdAt: string;
  updatedAt: string;
  previewUrl: string | null;
  alternativeText: string | null;
  provider_metadata: string | null;
}

interface MainImage {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
      thumbnail: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface BlogPostData {
  title: string;
  subTitle?: string;
  dateCreated: string;
  content: PayloadContent | ContentBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  heroImage: {
    url: string;
    width: number;
    height: number;
    filename: string;
    caption?: string;
    alt?: string;
    thumbnailURL?: string;
  };
  slug: string;
}

interface BlogPostResponse {
  data: BlogPostData;
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

interface ApiResponse {
  data: BlogPostResponse;
  meta: Meta;
}
