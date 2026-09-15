ALTER TABLE "BlogPost" ADD COLUMN "sections" JSONB NOT NULL DEFAULT '[]';

UPDATE "BlogPost"
SET "sections" = jsonb_build_array(
  jsonb_build_object(
    'title', "title",
    'paragraph', "paragraph"
  )
);

ALTER TABLE "BlogPost"
DROP COLUMN "category",
DROP COLUMN "bannerImage",
DROP COLUMN "paragraph",
DROP COLUMN "extraParagraph",
DROP COLUMN "listTitle",
DROP COLUMN "listItems";
