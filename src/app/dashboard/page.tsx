

"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Image,
  // Video,
  User,
  X,
  Loader2,
  Send,
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
  userImage?: string | null;
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
  interests?: string[];
  skills?: string[];
  achievements?: string[];
  photoURL?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentContent, setCommentContent] = useState<Record<string, string>>(
    {}
  );
  const [isCommenting, setIsCommenting] = useState<Record<string, boolean>>({});
  const [shareModalOpen, setShareModalOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "students", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            console.log("No user profile found");
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
    };

    const fetchPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(postsQuery);

        const postsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = { id: doc.id, ...doc.data() } as Post;

            // Fetch comments for each post
            const commentsQuery = query(
              collection(db, "posts", doc.id, "comments"),
              orderBy("timestamp", "desc")
            );

            const commentsSnapshot = await getDocs(commentsQuery);
            postData.commentsList = commentsSnapshot.docs.map((commentDoc) => ({
              id: commentDoc.id,
              ...commentDoc.data(),
            })) as Comment[];

            return postData;
          })
        );

        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchPosts();
  }, [currentUser]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(
      storage,
      `post-images/${currentUser.uid}/${Date.now()}-${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image: ", error);
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedImage(downloadURL);
          setIsUploading(false);
        } catch (error) {
          console.error("Error getting download URL: ", error);
          setIsUploading(false);
        }
      }
    );
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreatePost = async () => {
    if (!currentUser || (!newPostContent.trim() && !uploadedImage)) return;

    try {
      const fullName = userProfile
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : currentUser.email?.split("@")[0] || "User";

      const userTitle = userProfile?.branch
        ? `${userProfile.branch} Student - Year ${userProfile.year}`
        : "Student";

      await addDoc(collection(db, "posts"), {
        userId: currentUser.uid,
        userName: fullName,
        userTitle: userTitle,
        content: newPostContent,
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0,
        userImage: userProfile?.photoURL || null,
        image: uploadedImage || null,
        likedBy: [],
      });

      setNewPostContent("");
      setUploadedImage(null);

      // Refresh posts
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(postsQuery);

      const postsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const postData = { id: doc.id, ...doc.data() } as Post;

          // Fetch comments for each post
          const commentsQuery = query(
            collection(db, "posts", doc.id, "comments"),
            orderBy("timestamp", "desc")
          );

          const commentsSnapshot = await getDocs(commentsQuery);
          postData.commentsList = commentsSnapshot.docs.map((commentDoc) => ({
            id: commentDoc.id,
            ...commentDoc.data(),
          })) as Comment[];

          return postData;
        })
      );

      setPosts(postsData);
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  // Like functionality
  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        const likedBy = postData.likedBy || [];

        if (likedBy.includes(currentUser.uid)) {
          // Unlike the post
          await updateDoc(postRef, {
            likes: increment(-1),
            likedBy: arrayRemove(currentUser.uid),
          });

          // Update local state
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: post.likes - 1,
                    likedBy:
                      post.likedBy?.filter((id) => id !== currentUser.uid) ||
                      [],
                  }
                : post
            )
          );
        } else {
          // Like the post
          await updateDoc(postRef, {
            likes: increment(1),
            likedBy: arrayUnion(currentUser.uid),
          });

          // Update local state
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: post.likes + 1,
                    likedBy: [...(post.likedBy || []), currentUser.uid],
                  }
                : post
            )
          );
        }
      }
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  // Toggle comments section
  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    // Initialize comment content for this post if needed
    if (!commentContent[postId]) {
      setCommentContent((prev) => ({
        ...prev,
        [postId]: "",
      }));
    }
  };

  // Add a comment
  const handleAddComment = async (postId: string) => {
    if (!currentUser || !commentContent[postId]?.trim()) return;

    setIsCommenting((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      const fullName = userProfile
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : currentUser.email?.split("@")[0] || "User";

      // Add the comment to the comments subcollection
      const commentRef = await addDoc(
        collection(db, "posts", postId, "comments"),
        {
          userId: currentUser.uid,
          userName: fullName,
          userImage: userProfile?.photoURL || null,
          content: commentContent[postId],
          timestamp: serverTimestamp(),
        }
      );

      // Update the comment count on the post
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: increment(1),
      });

      // Add the new comment to local state
      const newComment = {
        id: commentRef.id,
        userId: currentUser.uid,
        userName: fullName,
        userImage: userProfile?.photoURL || null,
        content: commentContent[postId],
        timestamp: { toDate: () => new Date() } as { toDate: () => Date },
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments + 1,
              commentsList: [newComment, ...(post.commentsList || [])],
            };
          }
          return post;
        })
      );

      // Clear the comment input
      setCommentContent((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setIsCommenting((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  // Share functionality
  const handleShare = (postId: string) => {
    setShareModalOpen(postId);
  };

  const closeShareModal = () => {
    setShareModalOpen(null);
  };

  const shareToSocialMedia = (platform: string, postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    let shareUrl = "";
    const postUrl = `${window.location.origin}/post/${postId}`;
    const postContent =
      post.content.substring(0, 100) + (post.content.length > 100 ? "..." : "");

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          postUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          postContent
        )}&url=${encodeURIComponent(postUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          postUrl
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          postContent + " " + postUrl
        )}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Check this post&body=${encodeURIComponent(
          postContent + "\n\n" + postUrl
        )}`;
        break;
      case "copyLink":
        navigator.clipboard
          .writeText(postUrl)
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
  const formatTimestamp = (
    timestamp: { toDate: () => Date } | null | undefined
  ) => {
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

  // If not authenticated, show a message or redirect
  if (!currentUser && !loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your feed.
          </p>
          <a
            href="/signin"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow mb-4 p-4 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] resize-none"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={2}
          />
        </div>

        {/* Image preview */}
        {uploadedImage && (
          <div className="relative mb-3 mt-2 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={uploadedImage}
              alt="Upload preview"
              className="w-full h-auto max-h-96 object-contain"
            />
            <button
              onClick={removeUploadedImage}
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload progress */}
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <div className="flex space-x-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              ref={fileInputRef}
              disabled={isUploading}
            />
            <button
              className="flex items-center text-gray-600 hover:bg-gray-100 rounded-md px-3 py-1.5 transition-colors duration-200"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Image className="w-5 h-5 mr-1.5 text-blue-500" />
              <span className="text-sm font-medium">Photo</span>
            </button>
            {/* <button className="flex items-center text-gray-600 hover:bg-gray-100 rounded-md px-3 py-1.5 transition-colors duration-200">
              <Video className="w-5 h-5 mr-1.5 text-green-500" />
              <span className="text-sm font-medium">Video</span>
            </button> */}
          </div>
          <button
            className={`px-4 py-1.5 rounded-md text-sm font-medium
              ${
                newPostContent.trim() || uploadedImage
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
              transition-colors duration-200`}
            onClick={handleCreatePost}
            disabled={!newPostContent.trim() && !uploadedImage}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 inline animate-spin" />
                Uploading...
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow mb-4 hover:shadow-md transition-shadow duration-200"
          >
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
                    <h3 className="font-medium text-gray-900">
                      {post.userName}
                    </h3>
                    <p className="text-xs text-gray-500">{post.userTitle}</p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(post.timestamp)}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-sm text-gray-800 whitespace-pre-line">
                  {post.content}
                </p>
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
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp
                    className={`w-5 h-5 mr-1 ${
                      post.likedBy?.includes(currentUser?.uid || "")
                        ? "fill-blue-600"
                        : ""
                    }`}
                  />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button
                  className="flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded px-3 py-2 flex-1 transition-colors duration-200"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageSquare className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button
                  className="flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded px-3 py-2 flex-1 transition-colors duration-200"
                  onClick={() => handleShare(post.id)}
                >
                  <Share2 className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="mt-3 pt-3 border-t">
                  {/* Add Comment Form */}
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
                        type="text"
                        className="flex-1 border rounded-l-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Write a comment..."
                        value={commentContent[post.id] || ""}
                        onChange={(e) =>
                          setCommentContent((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg px-3 py-1 transition-colors duration-200"
                        onClick={() => handleAddComment(post.id)}
                        disabled={
                          isCommenting[post.id] ||
                          !commentContent[post.id]?.trim()
                        }
                      >
                        {isCommenting[post.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
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
                            <p className="text-sm text-gray-800 mt-1">
                              {comment.content}
                            </p>
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
              )}
            </div>

            {/* Share Modal */}
            {shareModalOpen === post.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Share this post
                    </h3>
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
                      onClick={() => shareToSocialMedia("facebook", post.id)}
                    >
                      Facebook
                    </button>
                    <button
                      className="flex items-center justify-center bg-sky-500 text-white rounded-lg py-2 px-4 hover:bg-sky-600 transition-colors duration-200"
                      onClick={() => shareToSocialMedia("twitter", post.id)}
                    >
                      Twitter
                    </button>
                    <button
                      className="flex items-center justify-center bg-blue-800 text-white rounded-lg py-2 px-4 hover:bg-blue-900 transition-colors duration-200"
                      onClick={() => shareToSocialMedia("linkedin", post.id)}
                    >
                      LinkedIn
                    </button>
                    <button
                      className="flex items-center justify-center bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 transition-colors duration-200"
                      onClick={() => shareToSocialMedia("whatsapp", post.id)}
                    >
                      WhatsApp
                    </button>
                    <button
                      className="flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-300 transition-colors duration-200"
                      onClick={() => shareToSocialMedia("email", post.id)}
                    >
                      Email
                    </button>
                    <button
                      className="flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-300 transition-colors duration-200"
                      onClick={() => shareToSocialMedia("copyLink", post.id)}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to share something with your campus community!
          </p>
        </div>
      )}
    </div>
  );
}
