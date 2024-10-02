"use client";

import { HtmlParser } from "@/components/global/html-parser";
import { NoResult } from "@/components/global/search/no-result";
import { PostAuthor } from "../../_components/post-feed/post-author";
import { Interactions } from "../../_components/post-feed/interaction";
import { useGetPost } from "@/hooks/channel";

type PostInfoProps = {
  id: string;
};

export const PostInfo = ({ id }: PostInfoProps) => {
  const { data } = useGetPost(id);

  if (data?.error)
    return (
      <div>
        <NoResult />
      </div>
    );

  return (
    <div className="flex flex-col gap-y-5">
      <PostAuthor
        username={`${data?.data?.post?.author.firstname} ${data?.data?.post?.author.lastname}`}
        image={data?.data.post?.author.image as string}
        channel={data?.data?.post?.channel.name as string}
      />
      <div className="flex flex-col gap-y-3">
        <h2 className="text-2xl font-bold">{data?.data?.post?.title}</h2>
        <HtmlParser html={data?.data?.post?.htmlContent as string} />
      </div>
      <Interactions
        id={id}
        page
        userid={data?.data?.post?.authorId}
        likedUser={
          data?.data?.post && data.data?.post?.likes.length > 0
            ? data?.data?.post.likes[0].userId
            : undefined
        }
        likeid={
          data?.data?.post && data.data?.post?.likes.length > 0
            ? data.data?.post.likes[0].id
            : undefined
        }
        likes={data?.data?.post?._count.likes}
        comments={data?.data?.post?._count.comments}
      />
    </div>
  );
};
