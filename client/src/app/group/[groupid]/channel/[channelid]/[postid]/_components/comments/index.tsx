"use client";

import { useComments, useReply } from "@/hooks/channel";
import { UserComment } from "./user-comments";

type PostCommentsProps = {
  postid: string;
};

export const PostComments = ({ postid }: PostCommentsProps) => {
  const { data } = useComments(postid);
  const { onReply, onSetReply, onSetActiveComment, activeComment } = useReply();

  return (
    <div className="mt-5">
      {data?.data?.comments ? (
        data?.data?.comments.map((comment: any) => (
          <UserComment
            id={comment.id}
            key={comment.id}
            onReply={() => onSetReply(comment.id)}
            reply={onReply}
            username={`${comment.user.firstname} ${comment.user.lastname}`}
            image={comment.user.image || ""}
            content={comment.content}
            postid={postid}
            replyCount={comment._count.reply}
            commentid={comment.commentId}
            replied={comment.replied}
            activeComment={activeComment}
            onActiveComment={() => onSetActiveComment(comment.id)}
          />
        ))
      ) : (
        <p className="text-themeTextGray">No Comments</p>
      )}
    </div>
  );
};
