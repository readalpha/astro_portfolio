// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

client
      .get({
        endpoint: 'blogs',
      })
      .then((res) => console.log(res));


// 型定義
export type Blog = {
  title: string;
  editor: string;
  eyecatch: object;
  publishedAt: string; // 記事の投稿日
  tags?: {
    id: string; // リレーションのID
    createdAt?: string; // MicroCMS標準フィールド
    updatedAt?: string; // MicroCMS標準フィールド
    publishedAt?: string; // MicroCMS標準フィールド
    revisedAt?: string; // MicroCMS標準フィールド
    name: string; // タグ名
  }[]; // タグは配列
} & MicroCMSListContent;

// APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({
    endpoint: "blogs",
    queries: {
      ...queries,
      fields: ["id", "title", "editor", "eyecatch", "publishedAt", "tags.id", "tags.name"], // 必要なフィールドを指定
    },
  });
};


export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};