import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Verification from "../assets/verification.png";
import Demon from "../assets/demon.jpeg";
import TestImage from "../assets/testimage1.jpeg";
import { formatDistanceToNow } from "date-fns";
import { useInformationLogic } from "./InformationLogic";

function Information() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    post,
    loading,
    error,
    commentText,
    commentLoading,
    isFollowing,
    isSubscribed,
    followLoading,
    subscribeLoading,
    token,
    handleFollow,
    handleSubscribe,
    handleCommentSubmit,
    setCommentText,
    setError,
  } = useInformationLogic(id);


  const getUserInitials = (username) => {
  return username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

  return (
    <div className="information">
      <Header />

      {/* Loading state */}
      {loading && (
        <div className="text-center mt-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#57B9FF]"></div>
          <p className="mt-2">Loading post...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-red-500 text-center mt-10 p-4">
          <p className="mb-4">{error}</p>
          <button
            className="bg-[#57B9FF] text-white px-4 py-2 rounded-lg hover:bg-[#517891]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}



      {/* Post content */}
      {post && !loading && (
        <>
          <div className="relative ml-4 md:ml-14  flex-col mt-28 flex overflow-hidden mb-20">
            <div className="flex-col space-y-2">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <p
                  className="text-xl sm:text-2xl md:text-3xl cursor-pointer  font-semibold font-sans hover:text-[#57B9FF] hover:font-bold"
                  onClick={() => navigate(`/hospital/${post.hospital}`)}
                >
                  {post.hospital_name || "Unknown Hospital"}
                </p>
                <img
                  src={Verification}
                  alt="verification badge"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg"
                />

                {/* Follow button */}
                <button
                  className={`ml-80 border rounded-lg px-4 h-10 transition-colors ${
                    followLoading
                      ? "bg-gray-400 cursor-not-allowed border-gray-400"
                      : isFollowing
                      ? "bg-[#57B9FF] text-white border-[#57B9FF] hover:bg-[#517891]"
                      : "border-[#57B9FF] hover:bg-[#57B9FF] hover:text-white"
                  }`}
                  onClick={handleFollow}
                  disabled={followLoading || !token}
                >
                  {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>

              {/* Divider */}
              <div className="w-full max-w-[700px] bg-gray-300 mb-8 h-[1px]"></div>

              <p className="font-bold text-xl sm:text-2xl md:text-3xl mb-4">
                {post.title || "No Title"}
              </p>

          
                <img
                  src={post.image || TestImage}
                  alt={post.title || "Post image"}
                  className="w-full max-w-[700px] h-auto sm:h-auto md:h-[500px] lg:h-[700px] xl:h-[800px] rounded-lg object-cover"
                  onError={(e) => {
                  console.log("Image failed to load, using fallback");
                  e.target.src = TestImage;
                  }}
                  />







              <p>
                <strong>Date:</strong> {post.date || "No Date"}
              </p>
              <p>
                <strong>Details:</strong> {post.details || "No Details"}
              </p>

              {/* Get alert button */}
              <button
                className={`border rounded-lg w-28 h-10 transition-colors ${
                  subscribeLoading
                    ? "bg-gray-400 cursor-not-allowed border-gray-400"
                    : !token
                    ? "border-gray-400 text-gray-400 cursor-not-allowed"
                    : isSubscribed
                    ? "bg-[#57B9FF] text-white border-[#57B9FF] hover:bg-[#517891]"
                    : "border-[#57B9FF] hover:bg-[#57B9FF] hover:text-white"
                }`}
                onClick={handleSubscribe}
                disabled={subscribeLoading || !token}
                title={!token ? "Login required" : isSubscribed ? "" : ""}
              >
                {subscribeLoading
                  ? "..."
                  : isSubscribed
                  ? "Unsubscribe"
                  : "Get Notified"}
              </button>
            </div>
          </div>

          {/* Comment section */}
          <div className="ml-4 md:ml-14 w-auto md:w-[90%] flex flex-col sm:flex-row items-start sm:items-center bg-gray-200 rounded-lg px-4 mb-10">
            {token ? (
              <>
                <textarea
                  className="flex-1 bg-transparent h-[100px] outline-none mt-2 resize-none w-full sm:w-auto"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={commentLoading}
                />
                <button
                  className={`sm:ml-2 px-6 py-2 rounded-lg mt-4 sm:mt-5 text-white transition-colors w-full sm:w-auto ${
                    commentLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#57B9FF] hover:bg-[#517891]"
                  }`}
                  onClick={handleCommentSubmit}
                  disabled={commentLoading || !commentText.trim()}
                >
                  {commentLoading ? "Posting..." : "Comment"}
                </button>
              </>
            ) : (
              <p className="text-gray-500 py-8">Log in to comment</p>
            )}
          </div>

          <div className="ml-4 md:ml-14 mb-10 w-auto md:w-[90%] border border-[#57B9FF] h-[1px] opacity-20"></div>

          <p className="ml-4 md:ml-14 text-2xl font-bold mb-10">
            Comments {post.comments?.length ? `(${post.comments.length})` : ""}
          </p>

          {/* Comments list */}
          <div className="flex-col">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div
                  key={comment.id || index}
                  className="flex flex-wrap md:flex-nowrap ml-4 md:ml-14 mt-10 mb-4 items-start gap-4"


                >


                  <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-500 flex items-center justify-center text-white font-semibold text-lg">
                  {getUserInitials(comment.username || "Unknown User")}
                  </div>
                {/* <img
                    src={Demon}
                    alt="user avatar"
                    className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
                  /> */}
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-lg">
                        {comment.username || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {comment.created_at
                          ? formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                            })
                          : "Unknown time"}
                      </p>
                    </div>
                    <p className="mt-2 text-gray-800">
                      {comment.text || "No Text"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="ml-14 text-gray-500 py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Information;










































