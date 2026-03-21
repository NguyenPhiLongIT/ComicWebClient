declare global {
    export interface IComment {
      id: string;
      content: string;
      user: IUser;
      comic: IComic;
      chapter: IChapter;
      createdAt: string;
      updatedAt: string;
    };
  }
  export {}
  