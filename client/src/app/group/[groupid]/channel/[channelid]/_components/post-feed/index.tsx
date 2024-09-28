"use client";

import InfiniteScrollObserver from "@/components/global/infinite-scroll";
import { PostCard } from "./post-card";
import { useChannelPage } from "@/hooks/channel";
import { PaginatedPosts } from "../paginated-post";

type PostFeedProps = {
  channelid: string;
  userid: string;
};

export const PostFeed = ({ channelid, userid }: PostFeedProps) => {
  const { data } = useChannelPage(channelid);
  const posts = data?.data?.channel.posts;
  return posts && posts.length > 0 ? (
    <>
      {posts.map((post: any) => (
        <PostCard
          key={post.id}
          channelname={post.channel.name!}
          title={post.title!}
          html={post.htmlContent!}
          username={post.author.firstname + post.author.lastname}
          userimage={post.author.image!}
          likes={post._count.likes}
          comments={post._count.comments}
          postid={post.id}
          likedUser={post.likes.length > 0 ? post.likes[0].userId : undefined}
          userid={userid}
          likeid={post.likes.length > 0 ? post.likes[0].id : undefined}
        />
      ))}
      <InfiniteScrollObserver
        action="POSTS"
        loading="POST"
        identifier={channelid}
        paginate={posts.length}
      >
        <PaginatedPosts userid={userid} />
      </InfiniteScrollObserver>
    </>
  ) : (
    <></>
  );
};
