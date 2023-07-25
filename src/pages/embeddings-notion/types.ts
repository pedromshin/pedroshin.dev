interface User {
  object: "user";
  id: string;
}

interface RichText {
  type: "text";
  text: {
    content: string;
    link: null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: "default";
  };
  plain_text: string;
  href: null;
}

interface BaseBlock {
  object: "block";
  id: string;
  parent: {
    type: "page_id";
    page_id: string;
  };
  created_time: string;
  last_edited_time: string;
  created_by: User;
  last_edited_by: User;
  has_children: boolean;
  archived: boolean;
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  paragraph: {
    rich_text: RichText[];
    color: "default";
  };
}

interface ToDoBlock extends BaseBlock {
  type: "to_do";
  to_do: {
    rich_text: RichText[];
    checked: boolean;
    color: "default";
  };
}

interface BulletedListItemBlock extends BaseBlock {
  type: "bulleted_list_item";
  bulleted_list_item: {
    rich_text: RichText[];
    color: "default";
  };
}

interface Heading1Block extends BaseBlock {
  type: "heading_1";
  heading_1: {
    rich_text: RichText[];
    is_toggleable: boolean;
    color: "default";
  };
}

interface Heading2Block extends BaseBlock {
  type: "heading_2";
  heading_2: {
    rich_text: RichText[];
    is_toggleable: boolean;
    color: "default";
  };
}

interface Heading3Block extends BaseBlock {
  type: "heading_3";
  heading_3: {
    rich_text: RichText[];
    is_toggleable: boolean;
    color: "default";
  };
}

interface TableBlock extends BaseBlock {
  type: "table";
  table: {
    table_width: number;
    has_column_header: boolean;
    has_row_header: boolean;
  };
}

interface ListBlock extends BaseBlock {
  type: "bulleted_list_item" | "numbered_list_item";
  bulleted_list_item: {
    rich_text: RichText[];
    color: "default";
  };
}

export type NotionPageResponse = {
  object: "list";
  results: Array<
    | ParagraphBlock
    | ToDoBlock
    | BulletedListItemBlock
    | Heading1Block
    | Heading2Block
    | Heading3Block
    | TableBlock
    | ListBlock
  >;
  next_cursor: null;
  has_more: boolean;
  type: "block";
  block: {};
};

// type NotionBlockTypes =

// export type NotionPageResponse = {
//   next_cursor: unknown;
//   block: unknown;
//   has_more: boolean;
//   type: string;
//   object: string;
//   results: {
//     object: string;
//     id: string;
//     parent: {
//       type: string;
//       page_id: string;
//     };
//     created_time: Date;
//     last_edited_time: Date;
//     created_by: {
//       object: string;
//       id: string;
//     };
//     last_edited_by: {
//       object: string;
//       id: string;
//     };
//     has_children: boolean;
//     archived: boolean;
//     type: "paragraph";
//     paragraph: {
//       rich_text: [
//         {
//           type: "text";
//           text: {
//             content: "Cooking an egg is a simple yet versatile culinary skill that can be mastered by anyone. To prepare a delicious egg, start by heating a non-stick skillet over medium heat. Add a small amount of butter or oil to the pan. Once the fat is heated, crack the egg gently and let it slide into the pan. For a perfect sunny-side-up egg, cook it until the whites are set, but the yolk remains runny. If you prefer an over-easy egg, carefully flip it and cook for a few seconds on the other side. Salt and pepper to taste, and serve on toast or alongside other breakfast favorites. Enjoy your delectable creation!";
//             link: null;
//           };
//           annotations: {
//             bold: false;
//             italic: false;
//             strikethrough: false;
//             underline: false;
//             code: false;
//             color: "default";
//           };
//           plain_text: "Cooking an egg is a simple yet versatile culinary skill that can be mastered by anyone. To prepare a delicious egg, start by heating a non-stick skillet over medium heat. Add a small amount of butter or oil to the pan. Once the fat is heated, crack the egg gently and let it slide into the pan. For a perfect sunny-side-up egg, cook it until the whites are set, but the yolk remains runny. If you prefer an over-easy egg, carefully flip it and cook for a few seconds on the other side. Salt and pepper to taste, and serve on toast or alongside other breakfast favorites. Enjoy your delectable creation!";
//           href: null;
//         }
//       ];
//       color: "default";
//     };
//   }[];
// };
