export interface Banner {
  publicId: string;
  url: string;
  width: number;
  height: number;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  banner: Banner;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: "draft" | "published";
  publishedAt: string;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  status: "draft" | "published";
  banner_image?: File;
}