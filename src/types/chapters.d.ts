declare global {
  export interface IPage {
    id: string;
    imageUrl: string;
    pageNum: number;
    chapterId: string;
  };

  export interface IChapter {
    id: number;
    title: string;
    slug: string;
    comic: IComic;
    number: number;
    createdAt: string;
    page: IPage[]
    comments: IComment[]
  };
}
export {}
