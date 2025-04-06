"use client";

import { useState, useEffect,  } from "react";
import { useAuth } from "@/context/AuthContext";
import { db,  } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  User,
  X,
  Loader2,
  Send,
  ArrowLeft,
} from "lucide-react";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userTitle?: string;
  content: string;
  timestamp: {
    toDate: () => Date;
  } | null;
  likes: number;
  comments: number;
  image?: string;
  userImage?: string;
  likedBy?: string[];
  commentsList?: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  timestamp: {
    toDate: () => Date;
  } | null;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  branch?: string;
  year?: string;
  photoURL?: string;
}

export default function PostPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { postId } = useParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) {
        setError("Post not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch the post
        const postRef = doc(db, "posts", postId as string);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          setError("Post not found");
          setLoading(false);
          return;
        }

        const postData = {
          id: postSnap.id,
          ...postSnap.data(),
        } as Post;

        // Fetch comments for the post
        const commentsQuery = query(
          collection(db, "posts", postId as string, "comments"),
          orderBy("timestamp", "desc")
        );

        const commentsSnapshot = await getDocs(commentsQuery);
        postData.commentsList = commentsSnapshot.docs.map((commentDoc) => ({
          id: commentDoc.id,
          ...commentDoc.data(),
        })) as Comment[];

        setPost(postData);

        // Fetch user profile if user is logged in
        if (currentUser) {
          const userDocRef = doc(db, "students", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, currentUser]);

  // Like functionality
  const handleLike = async () => {
    if (!currentUser || !post) return;

    try {
      const postRef = doc(db, "posts", post.id);

      if (post.likedBy?.includes(currentUser.uid)) {
        // Unlike the post
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUser.uid),
        });

        // Update local state
        setPost({
          ...post,
          likes: post.likes - 1,
          likedBy: post.likedBy.filter((id) => id !== currentUser.uid),
        });
      } else {
        // Like the post
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUser.uid),
        });

        // Update local state
        setPost({
          ...post,
          likes: post.likes + 1,
          likedBy: [...(post.likedBy || []), currentUser.uid],
        });
      }
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  // Add a comment
  const handleAddComment = async () => {
    if (!currentUser || !post || !commentContent.trim()) return;

    setIsCommenting(true);

    try {
      const fullName = userProfile
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : currentUser.email?.split("@")[0] || "User";

      // Add the comment to the comments subcollection
      const commentRef = await addDoc(collection(db, "posts", post.id, "comments"), {
        userId: currentUser.uid,
        userName: fullName,
        userImage: userProfile?.photoURL || null,
        content: commentContent,
        timestamp: serverTimestamp(),
      });

      // Update the comment count on the post
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        comments: increment(1),
      });

      // Add the new comment to local state
      const newComment = {
        id: commentRef.id,
        userId: currentUser.uid,
        userName: fullName,
        userImage: userProfile?.photoURL || undefined,
        content: commentContent,
        timestamp: { toDate: () => new Date() } as { toDate: () => Date },
      };

      setPost({
        ...post,
        comments: post.comments + 1,
        commentsList: [newComment, ...(post.commentsList || [])],
      });

      // Clear the comment input
      setCommentContent("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setIsCommenting(false);
    }
  };

  // Share functionality
  const handleShare = () => {
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  const shareToSocialMedia = (platform: string) => {
    if (!post) return;

    let shareUrl = "";
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const postContent = post.content.substring(0, 100) + (post.content.length > 100 ? "..." : "");

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postContent)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(postContent + " " + postUrl)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Check this post&body=${encodeURIComponent(postContent + "\n\n" + postUrl)}`;
        break;
      case "copyLink":
        navigator.clipboard.writeText(postUrl)
          .then(() => {
            alert("Link copied to clipboard!");
            closeShareModal();
          })
          .catch((err) => {
            console.error("Could not copy link: ", err);
          });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      closeShareModal();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: { toDate: () => Date } | null | undefined) => {
    if (!timestamp) return "Just now";

    const now = new Date();
    const postDate = timestamp.toDate();
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;

    return postDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Post not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
      </div>

      {/* Post Card */}
      <div className="bg-white rounded-lg shadow mb-4 hover:shadow-md transition-shadow duration-200">
        <div className="p-4">
          {/* Post Header */}
          <div className="flex justify-between mb-3">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                {post.userImage ? (
                  <img
                    src={post.userImage}
                    alt={post.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{post.userName}</h3>
                <p className="text-xs text-gray-500">{post.userTitle}</p>
                <p className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-500">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-3">
            <p className="text-sm text-gray-800 whitespace-pre-line">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="mb-3 -mx-4">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}

          {/* Post Stats */}
          <div className="flex justify-between text-xs text-gray-500 mb-2 pt-1 border-t">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
          </div>

          {/* Post Actions */}
          <div className="flex justify-between pt-1 border-t">
            <button
              className={`flex items-center justify-center rounded px-3 py-2 flex-1 transition-colors duration-200 ${
                post.likedBy?.includes(currentUser?.uid || "")
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={handleLike}
              disabled={!currentUser}
            >
              <ThumbsUp className={`w-5 h-5 mr-1 ${
                post.likedBy?.includes(currentUser?.uid || "") ? "fill-blue-600" : ""
              }`} />
              <span className="text-sm font-medium">Like</span>
            </button>
            <button
              className="flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded px-3 py-2 flex-1 transition-colors duration-200"
              onClick={() => document.getElementById('commentInput')?.focus()}
            >
              <MessageSquare className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Comment</span>
            </button>
            <button
              className="flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded px-3 py-2 flex-1 transition-colors duration-200"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-3 pt-3 border-t">
            {/* Add Comment Form */}
            {currentUser ? (
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 flex">
                  <input
                    id="commentInput"
                    type="text"
                    className="flex-1 border rounded-l-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment();
                      }
                    }}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg px-3 py-1 transition-colors duration-200"
                    onClick={handleAddComment}
                    disabled={isCommenting || !commentContent.trim()}
                  >
                    {isCommenting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 text-center">
                <p className="text-sm text-gray-600 mb-2">Sign in to like and comment on this post</p>
                <Link
                  href="/signin"
                  className="inline-block bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <h4 className="font-medium text-gray-900 mb-3">Comments ({post.comments})</h4>
            {post.commentsList && post.commentsList.length > 0 ? (
              <div className="space-y-3">
                {post.commentsList.map((comment) => (
                  <div key={comment.id} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
                      {comment.userImage ? (
                        <img
                          src={comment.userImage}
                          alt={comment.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-medium text-gray-900">
                          {comment.userName}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>

        {/* Share Modal */}
        {shareModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Share this post</h3>
                <button
                  onClick={closeShareModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex items-center justify-center bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => shareToSocialMedia("facebook")}
                >
                  Facebook
                </button>
                <button
                  className="flex items-center justify-center bg-sky-500 text-white rounded-lg py-2 px-4 hover:bg-sky-600 transition-colors duration-200"
                  onClick={() => shareToSocialMedia("twitter")}
                >
                  Twitter
                </button>
                <button
                  className="flex items-center justify-center bg-blue-800 text-white rounded-lg py-2 px-4 hover:bg-blue-900 transition-colors duration-200"
                  onClick={() => shareToSocialMedia("linkedin")}
                >
                  LinkedIn
                </button>
                <button
                  className="flex items-center justify-center bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 transition-colors duration-200"
                  onClick={() => shareToSocialMedia("whatsapp")}
                >
                  WhatsApp
                </button>
                <button
                  className="flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => shareToSocialMedia("email")}
                >
                  Email
                </button>
                <button
                  className="flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => shareToSocialMedia("copyLink")}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}